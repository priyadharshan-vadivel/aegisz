CREATE TYPE "public"."lead_type" AS ENUM('contact', 'download');--> statement-breakpoint
CREATE TABLE "files" (
	"key" text PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"bytes" "bytea" NOT NULL,
	"sha256" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"type" "lead_type" NOT NULL,
	"name" text NOT NULL,
	"work_email" text NOT NULL,
	"phone" text NOT NULL,
	"company" text NOT NULL,
	"role" text,
	"interest" text,
	"message" text,
	"consent_at" timestamp with time zone NOT NULL,
	"source_page" text NOT NULL,
	"ip_hash" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_work_email_idx" ON "leads" USING btree ("work_email");