# Setting up booking, forms, the leads database and email

- **Book a demo** buttons open the Cal.id scheduler. `/contact` also embeds it.
- The contact form (`/contact`) and the IAAC overview form (`/products/iaac#download`) save every submission to a **Neon Postgres** database and email you through **Resend**.
- The IAAC overview reaches people as an emailed link that works for 7 days. Nothing downloads on the page.
- Bots are blocked with **Cloudflare Turnstile**, a honeypot field and a rate limit.
- Everything is configured with environment variables in **Vercel**.

Until a form is configured it shows "isn't configured yet", with a fallback to contact@aegisz.in:

- The contact form works once it has a database **or** email.
- The overview form needs email and `DOWNLOAD_SECRET`.

Allow about 45 minutes, most of which is waiting for DNS to verify.

## 0. Leads database (Neon, through Vercel)

1. In Vercel, open your project, then **Storage → Create Database**, and choose **Neon** (Serverless Postgres) from the Marketplace. Accept the terms, then pick the region closest to India (for example *Asia Pacific (Singapore)*) and the free plan.
2. Connect it to this project for **Production** and **Preview**. Vercel adds `DATABASE_URL` (and a few related `PG*`/`POSTGRES_*` variables) to the project automatically.
3. On your computer, in the project folder, pull the variables into a local `.env`. The file is git-ignored; never commit it.
   ```
   npx vercel link          # once: pick this project
   npx vercel env pull .env
   ```
4. Create the tables:
   ```
   npm run db:migrate
   ```
   This applies the SQL in `drizzle/` and creates `leads` and `files`. Run it again after any schema change. To make a schema change, edit `src/lib/server/db/schema.ts`, then run `npm run db:generate` and commit the new file in `drizzle/`.
5. Store the IAAC overview PDF in the database. The public repo can't hold it, so the download link serves it from the `files` table:
   ```
   npm run pdf:upload                          # uses private/iaac-overview.pdf
   npm run pdf:upload -- path/to/other.pdf     # or a specific file
   ```
   Run it again whenever the PDF changes. Existing links keep working and serve the new file.

### The `leads` table

| Column | Notes |
|---|---|
| `id`, `created_at` | UUID and timestamp, set automatically |
| `type` | `contact` or `download` |
| `name`, `work_email`, `phone`, `company` | Phone is stored in E.164 format, e.g. `+919876543210` |
| `role`, `interest`, `message` | Contact form only (`interest` is `iaac-overview` for downloads) |
| `consent_at` | When the person ticked the consent box |
| `source_page` | The page the form was sent from |
| `ip_hash` | A keyed hash of the IP address (never the raw address) |
| `user_agent` | The browser's user agent |

There is no admin page. Use the export below, or Neon's SQL editor in the Neon console (Vercel → Storage → your database → **Open in Neon**).

### Exporting leads

```
npm run leads:export                                  # all leads
npm run leads:export -- --type contact                # only contact-form leads
npm run leads:export -- --type download --since 2026-01-01
```

This writes `exports/leads-YYYY-MM-DD.csv`, which opens in Excel or Google Sheets. `exports/` is git-ignored because it holds personal data. Phone numbers appear as `'+91…`: the leading apostrophe stops spreadsheets from treating cells as formulas.

### Deleting someone's data on request

In the Neon SQL editor:

```sql
delete from leads where lower(work_email) = lower('person@company.com');
```

Their emails also sit in your Resend logs (Resend → Emails) and in your inbox, so delete those as well. The privacy notice promises deletion after 24 months; run this periodically:

```sql
delete from leads where created_at < now() - interval '24 months';
```

## 1. Resend: API key and domain

1. Sign up at [resend.com](https://resend.com) using the inbox that should receive submissions.
2. Go to **Domains → Add domain** and enter `aegisz.in`. Pick the region closest to you; it only affects the MX value in step 2.
3. Resend shows three DNS records. Leave that page open: you'll copy its exact values into Hostinger next.
4. Go to **API Keys → Create API key**. Use the name `aegisz-website` and the permission **Sending access**, then copy the key (it starts with `re_`). You'll only see it once.

## 2. Hostinger DNS for aegisz.in

In hPanel open **Domains → aegisz.in → DNS / Nameservers → Manage DNS records**, then add these records with the values Resend gave you. In Hostinger's **Name** field, type only the part shown, not the full domain.

| Type | Name | Value | Priority | TTL |
|---|---|---|---|---|
| TXT | `resend._domainkey` | the `p=MIGf…` DKIM key from Resend | | 3600 |
| MX | `send` | `feedback-smtp.<region>.amazonses.com` (copy from Resend) | 10 | 3600 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | | 3600 |

Optional, but it improves deliverability:

| Type | Name | Value |
|---|---|---|
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

### Leave ImprovMX alone

Your inbound mail forwarding uses ImprovMX records on the **root** domain (`@`):

- MX `@` → `mx1.improvmx.com` (priority 10) and `mx2.improvmx.com` (priority 20)
- TXT `@` → `v=spf1 include:spf.improvmx.com ~all`

**Don't edit or delete these.** Resend's MX and SPF records sit on the `send.` subdomain, so they don't touch the root records, and you don't need to merge any SPF values. If a `_dmarc` record already exists, keep it and skip the optional one above, because a domain can only have one.

Then go back to Resend and click **Verify DNS records**. Verification usually takes a few minutes but can take a few hours. The domain shows **Verified** when it's done.

> If aegisz.in's nameservers point somewhere other than Hostinger (for example Vercel or Cloudflare), add the records wherever DNS is actually hosted.

## 3. Cloudflare Turnstile (spam protection)

1. In the [Cloudflare dashboard](https://dash.cloudflare.com) open **Turnstile → Add widget**. You don't need to move your domain to Cloudflare.
2. Name it `aegisz.in`, add the hostnames `aegisz.in`, `www.aegisz.in` and `localhost`, and set the mode to **Managed**.
3. Copy the **Site key** and the **Secret key**.

If `TURNSTILE_SECRET_KEY` is empty the check is skipped, so the forms still work while you set this up. The honeypot field and the rate limit (5 submissions per IP per 10 minutes) are always on.

## 4. Environment variables in Vercel

In Vercel open **Project → Settings → Environment Variables** and add these for **Production**. Add them for **Preview** too if you want preview deployments to save leads and send real email.

| Name | Required? | What it does | Where to get it |
|---|---|---|---|
| `DATABASE_URL` | Yes | Leads database and the stored PDF | Set automatically by the Neon integration (step 0) |
| `NEXT_PUBLIC_BOOKING_URL` | Recommended | Where every **Book a demo** button goes | Your Cal.id link, e.g. `https://cal.id/priyadharshan-aegisz`. Without it, that link is used. |
| `RESEND_API_KEY` | Yes | Sends notification, confirmation and overview emails | The `re_…` key from step 1 |
| `CONTACT_TO_EMAIL` | Yes | Where lead notifications arrive | e.g. `contact@aegisz.in` |
| `CONTACT_FROM_EMAIL` | Yes | Sender address | `noreply@aegisz.in` (any address on the verified domain) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Recommended | Shows the bot check on forms | Turnstile site key (step 3) |
| `TURNSTILE_SECRET_KEY` | Recommended | Verifies the bot check | Turnstile secret key (step 3). If empty, the check is skipped. |
| `DOWNLOAD_SECRET` | Yes | Signs the 7-day IAAC overview links | Generate one (see below) |
| `IP_HASH_SECRET` | Optional | Hashes visitor IPs before storage | Generate one. Falls back to `DOWNLOAD_SECRET`. |
| `SITE_URL` | Optional | Base URL for links in emails | Defaults to `https://aegisz.in` in production and the preview URL on previews |

Generate each secret with:

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Changing `DOWNLOAD_SECRET` immediately invalidates every link already emailed. If that happens, people can request a new one.

Then go to **Deployments → ⋯ → Redeploy**. A redeploy is required because the `NEXT_PUBLIC_…` variables are read at build time.

## 5. Check it works

1. Open `/contact`. The Cal.id scheduler should appear under **Book a demo**, and **Open the scheduler** should open Cal.id in a new tab. If the embedded scheduler stays blank, check that your Cal.id event is public. The button always works.
2. Submit **Or send us a message** with a work address you can read:
   - you should receive `[IAAC question] Company — Name` (or the tag for the interest you chose) at `CONTACT_TO_EMAIL`
   - the sender gets a short confirmation
   - `npm run leads:export` shows the row
3. Submit the overview form on `/products/iaac#download`:
   - the page should say **Check your inbox**
   - the requester gets "Your IAAC overview" with a link that downloads the PDF
   - you receive `[IAAC overview request] Company — Name`
4. In Resend, open **Emails** to see each message's delivery status.

If email fails, contact leads are still saved, and the owner email says whether the database save worked. The server logs (Vercel → **Logs**) show `[forms] … failed` lines for either problem.

## Running locally

```
npx vercel env pull .env     # or: cp .env.example .env and fill in values
npm run db:migrate           # first time, and after schema changes
npm run build && npm start   # http://localhost:3000
npm test                     # form, lead, link-expiry, simulator and no-TODO tests (no email, no DB)
```

The no-TODO test checks the pages from the last `npm run build`, so run a build first.

## The IAAC overview PDF

The emailed link serves the PDF from the database's `files` table (`npm run pdf:upload`, step 0). Locally, if no database is configured, it falls back to `private/iaac-overview.pdf`.

**The PDF is not in git**, because the GitHub repo is public. If it's in neither the database nor `private/`, the link answers "isn't available right now" and points people to contact@aegisz.in.

To rebuild it from a new deck with the pricing slide removed, then upload it:

```
node scripts/make-overview-pdf.mjs path/to/IAAC-Profile.pdf
npm run pdf:upload
```

Check `PRICING_PAGE` at the top of the script first if the slide order has changed. Keep the source deck out of git; `/IAAC-Profile.pdf` is already in `.gitignore`.