import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey, serial, text, timestamp, vector, integer, varchar } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ajf_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("created_by_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  password: d.varchar({ length: 255 }),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);



//Job list with embedding vector
export const jobList = createTable("job_list", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().unique(),
  title: text("title").notNull(),
  companyName: text("company_name").notNull(),
  companyLogo: text("company_logo"),
  category: text("category"),
  jobType: text("job_type"),
  publicationDate: timestamp("publication_date"),
  location: text("location"),
  salary: text("salary"),
  url: text("url"),
  description: text("description"),
  embedding: vector("embedding", { dimensions: 1536 }), // text-embedding-3-small dimesion = 1536
});

//Resume embedding vector
export const resumeVector = createTable("resume_vector", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  embeddingText: text("embedding_text"),
  embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow(),
})

//Profile
export const profileDetails = createTable("profile_detail", (d) => ({
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  title: varchar("title", { length: 255 }),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  joinDate: timestamp("join_date").defaultNow(),
  about: text("about"),
}));  

//Skills
export const skills = createTable("skill", (d) => ({
  id: serial("id").primaryKey(),
  profileDetailsId: integer("profil_details_id")
    .notNull()
    .references(() => profileDetails.id),
  name: text("name").notNull(),
}));

//Experience
export const experiences = createTable("experience", (d) => ({
  id: serial("id").primaryKey(),
  profileDetailsId: integer("profil_details_id")
    .notNull()
    .references(() => profileDetails.id),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  period: varchar("period", { length: 255 }).notNull(),
  description: text("description"),
}));

//Education
export const educations = createTable("education", (d) => ({
  id: serial("id").primaryKey(),
  profileDetailsId: integer("profil_details_id")
    .notNull()
    .references(() => profileDetails.id),
  degree: varchar("degree", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  period: varchar("period", { length: 255 }).notNull(),
}));

//Certifications
export const certifications = createTable("certification", (d) => ({
  id: serial("id").primaryKey(),
  profileDetailsId: integer("profil_details_id")
    .notNull()
    .references(() => profileDetails.id),
  name: varchar("name", { length: 255 }).notNull(),
  issuer: varchar("issuer", { length: 255 }),
  date: varchar("date", { length: 255 }), // Bisa juga timestamp, tergantung kebutuhan
}));

//Relation
export const profileRelations = relations(profileDetails, ({ one }) => ({
  user: one(users, { fields: [profileDetails.userId], references: [users.id] }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  profileDetail: one(profileDetails, {
    fields: [skills.profileDetailsId],
    references: [profileDetails.id],
  }),
}));

export const experiencesRelations = relations(experiences, ({ one }) => ({
  profileDetail: one(profileDetails, { fields: [experiences.profileDetailsId], references: [profileDetails.id] }),
}));

export const educationsRelations = relations(educations, ({ one }) => ({
  profileDetail: one(profileDetails, { fields: [educations.profileDetailsId], references: [profileDetails.id] }),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
  profileDetail: one(profileDetails, { fields: [certifications.profileDetailsId], references: [profileDetails.id] }),
}));
