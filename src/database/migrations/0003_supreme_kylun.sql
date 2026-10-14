ALTER TABLE "rides" ALTER COLUMN "price" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "passenger_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "seats_requested" integer DEFAULT 1 NOT NULL;