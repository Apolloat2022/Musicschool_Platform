import { pgTable, unique, serial, text, timestamp, foreignKey, integer, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const musicClasses = pgTable("music_classes", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	instrument: text(),
	dayOfWeek: text("day_of_week"),
	startTime: text("start_time"),
	jitsiRoomName: text("jitsi_room_name"),
	googleCourseId: text("google_course_id"),
	zoomMeetingNumber: text("zoom_meeting_number"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("music_classes_jitsi_room_name_unique").on(table.jitsiRoomName),
]);

export const exitRequests = pgTable("exit_requests", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	subscriptionId: integer("subscription_id").notNull(),
	status: text().default('PENDING').notNull(),
	requestedAt: timestamp("requested_at", { mode: 'string' }).defaultNow(),
	processedAt: timestamp("processed_at", { mode: 'string' }),
	note: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "exit_requests_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.subscriptionId],
			foreignColumns: [subscriptions.id],
			name: "exit_requests_subscription_id_subscriptions_id_fk"
		}),
]);

export const purchases = pgTable("purchases", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	serviceId: integer("service_id").notNull(),
	stripePaymentIntentId: text("stripe_payment_intent_id"),
	status: text().default('PENDING').notNull(),
	amountPaidCents: integer("amount_paid_cents").notNull(),
	purchasedAt: timestamp("purchased_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "purchases_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "purchases_service_id_services_id_fk"
		}),
	unique("purchases_stripe_payment_intent_id_unique").on(table.stripePaymentIntentId),
]);

export const services = pgTable("services", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	priceCents: integer("price_cents").notNull(),
	creditAmount: integer("credit_amount").default(0),
	stripePriceId: text("stripe_price_id"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const subscriptionPlans = pgTable("subscription_plans", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	track: text().notNull(),
	monthlyPriceCents: integer("monthly_price_cents").notNull(),
	creditDeposit: integer("credit_deposit").default(0),
	stripePriceId: text("stripe_price_id"),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const enrollments = pgTable("enrollments", {
	id: serial().primaryKey().notNull(),
	studentName: text("student_name").notNull(),
	studentEmail: text("student_email").notNull(),
	classId: integer("class_id"),
	enrolledAt: timestamp("enrolled_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.classId],
			foreignColumns: [musicClasses.id],
			name: "enrollments_class_id_music_classes_id_fk"
		}),
]);

export const subscriptions = pgTable("subscriptions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	planId: integer("plan_id").notNull(),
	stripeSubscriptionId: text("stripe_subscription_id"),
	stripeCustomerId: text("stripe_customer_id"),
	status: text().default('ACTIVE').notNull(),
	creditBalance: integer("credit_balance").default(0),
	currentPeriodStart: timestamp("current_period_start", { mode: 'string' }),
	currentPeriodEnd: timestamp("current_period_end", { mode: 'string' }),
	exitRequestedAt: timestamp("exit_requested_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "subscriptions_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.planId],
			foreignColumns: [subscriptionPlans.id],
			name: "subscriptions_plan_id_subscription_plans_id_fk"
		}),
	unique("subscriptions_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
]);

export const creditTransactions = pgTable("credit_transactions", {
	id: serial().primaryKey().notNull(),
	subscriptionId: integer("subscription_id").notNull(),
	type: text().notNull(),
	amount: integer().notNull(),
	serviceType: text("service_type"),
	note: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.subscriptionId],
			foreignColumns: [subscriptions.id],
			name: "credit_transactions_subscription_id_subscriptions_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	clerkId: text("clerk_id").notNull(),
	email: text().notNull(),
	name: text().notNull(),
	stripeCustomerId: text("stripe_customer_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_clerk_id_unique").on(table.clerkId),
	unique("users_email_unique").on(table.email),
	unique("users_stripe_customer_id_unique").on(table.stripeCustomerId),
]);
