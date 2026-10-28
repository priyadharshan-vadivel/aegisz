# Setting up forms and email

The contact form (`/contact`) and the IAAC overview download (`/products/iaac#download`) send email through **Resend**, block bots with **Cloudflare Turnstile**, and are configured with environment variables in **Vercel**. Until these are set, both forms show "isn't configured yet" with a fallback to contact@aegisz.in.

Allow about 30 minutes, most of which is waiting for DNS to verify.

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

In Vercel open **Project → Settings → Environment Variables** and add these for **Production**, and for **Preview** if you want preview deployments to send real email:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | the `re_…` key from step 1 |
| `CONTACT_TO_EMAIL` | where submissions should arrive, e.g. `contact@aegisz.in` |
| `CONTACT_FROM_EMAIL` | `noreply@aegisz.in` (any address on the verified domain) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key |
| `GATED_DOWNLOAD` | `true` (form first) or `false` (direct download) |
| `DOWNLOAD_SECRET` | a long random string, see below |

Generate `DOWNLOAD_SECRET` once:

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Then go to **Deployments → ⋯ → Redeploy**. A redeploy is required because `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `GATED_DOWNLOAD` are read at build time.

## 5. Check it works

1. Submit `/contact` with a work address you can read. You should receive `[IAAC demo] Company — Name` at `CONTACT_TO_EMAIL`, and the sender should get a short confirmation.
2. Submit the download form on `/products/iaac#download`. The PDF should download, and you should receive `[IAAC overview download] Company — Name`.
3. In Resend, open **Emails** to see each message's delivery status.

## Running locally

```
cp .env.example .env.local   # then fill in the values
npm run build && npm start   # http://localhost:3000
npm test                     # simulator + form pipeline tests (no email is sent)
```

## The IAAC overview PDF

The download serves `private/iaac-overview.pdf`. It sits outside `public/`, so it can't be fetched without a valid link.

**It is not in git**, because the GitHub repo is public and a committed PDF could be downloaded there, bypassing the form. Until the file is present in a deployment, the download route answers "isn't available right now" and points people to contact@aegisz.in. To include it, deploy with the file present, for example `vercel --prod` from a machine that has `private/iaac-overview.pdf`. Alternatively, keep the PDF in private storage and change `src/app/api/download/route.ts` to fetch it from there.

To rebuild it from a new deck with the pricing slide removed:

```
node scripts/make-overview-pdf.mjs path/to/IAAC-Profile.pdf
```

Check `PRICING_PAGE` at the top of the script first if the slide order has changed. Keep the source deck out of git; `/IAAC-Profile.pdf` is already in `.gitignore`.
