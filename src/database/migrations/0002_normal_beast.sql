ALTER TABLE "drivers" DROP CONSTRAINT "drivers_user_id_unique";--> statement-breakpoint
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_email_unique";--> statement-breakpoint
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_phone_unique";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "drivers" DROP COLUMN "password_hash";