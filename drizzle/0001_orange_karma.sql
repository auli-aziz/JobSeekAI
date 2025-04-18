CREATE TABLE "ajf_certification" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"issuer" varchar(255),
	"date" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "ajf_education" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"degree" varchar(255) NOT NULL,
	"institution" varchar(255) NOT NULL,
	"period" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ajf_experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"period" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "ajf_job_list" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"title" text NOT NULL,
	"company_name" text NOT NULL,
	"company_logo" text,
	"category" text,
	"job_type" text,
	"publication_date" timestamp,
	"location" text,
	"salary" text,
	"url" text,
	"description" text,
	"embedding" vector(1536),
	CONSTRAINT "ajf_job_list_job_id_unique" UNIQUE("job_id")
);
--> statement-breakpoint
CREATE TABLE "ajf_profile_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255),
	"location" varchar(255),
	"phone" varchar(255),
	"join_date" timestamp DEFAULT now(),
	"about" text
);
--> statement-breakpoint
CREATE TABLE "ajf_resume_vector" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"embedding_text" text,
	"embedding" vector(1536),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ajf_skill" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ajf_user" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "ajf_certification" ADD CONSTRAINT "ajf_certification_user_id_ajf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ajf_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ajf_education" ADD CONSTRAINT "ajf_education_user_id_ajf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ajf_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ajf_experience" ADD CONSTRAINT "ajf_experience_user_id_ajf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ajf_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ajf_profile_detail" ADD CONSTRAINT "ajf_profile_detail_user_id_ajf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ajf_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ajf_resume_vector" ADD CONSTRAINT "ajf_resume_vector_user_id_ajf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ajf_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ajf_skill" ADD CONSTRAINT "ajf_skill_user_id_ajf_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ajf_user"("id") ON DELETE no action ON UPDATE no action;