import { pgTable, unique, serial, text, timestamp, foreignKey, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Music Classes ────────────────────────────────────────────────
export const musicClasses = pgTable("music_classes", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  instrument: text("instrument"),
  dayOfWeek: text("day_of_week"),
  startTime: text("start_time"),
  jitsiRoomName: text("jitsi_room_name").unique(),
  googleCourseId: text("google_course_id"),
  zoomMeetingNumber: text("zoom_meeting_number"),
  createdAt: timestamp("created_at").defaultNow(),
  teacherName: text("teacher_name").default("TBA"),
});

// ─── Enrollments ──────────────────────────────────────────────────
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey().notNull(),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  classId: integer("class_id").references(() => musicClasses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// ─── Users (Clerk-linked) ─────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Services (one-time purchases) ───────────────────────────────
export const services = pgTable("services", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  creditAmount: integer("credit_amount").default(0),
  stripePriceId: text("stripe_price_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Subscription Plans ───────────────────────────────────────────
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  track: text("track").notNull(),
  monthlyPriceCents: integer("monthly_price_cents").notNull(),
  creditDeposit: integer("credit_deposit").default(0),
  stripePriceId: text("stripe_price_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Subscriptions ────────────────────────────────────────────────
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeCustomerId: text("stripe_customer_id"),
  status: text("status").default("ACTIVE").notNull(),
  creditBalance: integer("credit_balance").default(0),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  exitRequestedAt: timestamp("exit_requested_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Purchases (one-time) ─────────────────────────────────────────
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
  status: text("status").default("PENDING").notNull(),
  amountPaidCents: integer("amount_paid_cents").notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

// ─── Credit Transactions ──────────────────────────────────────────
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey().notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id).notNull(),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  serviceType: text("service_type"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Exit Requests ────────────────────────────────────────────────
export const exitRequests = pgTable("exit_requests", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id).notNull(),
  status: text("status").default("PENDING").notNull(),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  note: text("note"),
});

// ─── Attendance & Learning Hours ──────────────────────────────────
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey().notNull(),
  enrollmentId: integer("enrollment_id").references(() => enrollments.id).notNull(),
  classId: integer("class_id").references(() => musicClasses.id).notNull(),
  date: timestamp("date").notNull(),
  status: text("status").default("PRESENT").notNull(), // PRESENT, ABSENT, EXCUSED
  durationMinutes: integer("duration_minutes").default(60), // Standard 60 mins per session
  teacherNotes: text("teacher_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────
export const musicClassRelations = relations(musicClasses, ({ many }) => ({
  enrollments: many(enrollments),
  attendance: many(attendance),
}));

export const enrollmentRelations = relations(enrollments, ({ one, many }) => ({
  musicClass: one(musicClasses, {
    fields: [enrollments.classId],
    references: [musicClasses.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [attendance.enrollmentId],
    references: [enrollments.id],
  }),
  musicClass: one(musicClasses, {
    fields: [attendance.classId],
    references: [musicClasses.id],
  }),
}));
// Cleaned up duplicates

export const userRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  purchases: many(purchases),
  exitRequests: many(exitRequests),
}));

export const subscriptionPlanRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [subscriptions.planId], references: [subscriptionPlans.id] }),
  creditTransactions: many(creditTransactions),
  exitRequests: many(exitRequests),
}));

export const serviceRelations = relations(services, ({ many }) => ({
  purchases: many(purchases),
}));

export const purchaseRelations = relations(purchases, ({ one }) => ({
  user: one(users, { fields: [purchases.userId], references: [users.id] }),
  service: one(services, { fields: [purchases.serviceId], references: [services.id] }),
}));

export const creditTransactionRelations = relations(creditTransactions, ({ one }) => ({
  subscription: one(subscriptions, { fields: [creditTransactions.subscriptionId], references: [subscriptions.id] }),
}));

export const exitRequestRelations = relations(exitRequests, ({ one }) => ({
  user: one(users, { fields: [exitRequests.userId], references: [users.id] }),
  subscription: one(subscriptions, { fields: [exitRequests.subscriptionId], references: [subscriptions.id] }),
}));
