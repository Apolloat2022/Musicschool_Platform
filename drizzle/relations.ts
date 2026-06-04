import { relations } from "drizzle-orm/relations";
import { users, exitRequests, subscriptions, purchases, services, musicClasses, enrollments, subscriptionPlans, creditTransactions } from "./schema";

export const exitRequestsRelations = relations(exitRequests, ({one}) => ({
	user: one(users, {
		fields: [exitRequests.userId],
		references: [users.id]
	}),
	subscription: one(subscriptions, {
		fields: [exitRequests.subscriptionId],
		references: [subscriptions.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	exitRequests: many(exitRequests),
	purchases: many(purchases),
	subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({one, many}) => ({
	exitRequests: many(exitRequests),
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	}),
	subscriptionPlan: one(subscriptionPlans, {
		fields: [subscriptions.planId],
		references: [subscriptionPlans.id]
	}),
	creditTransactions: many(creditTransactions),
}));

export const purchasesRelations = relations(purchases, ({one}) => ({
	user: one(users, {
		fields: [purchases.userId],
		references: [users.id]
	}),
	service: one(services, {
		fields: [purchases.serviceId],
		references: [services.id]
	}),
}));

export const servicesRelations = relations(services, ({many}) => ({
	purchases: many(purchases),
}));

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
	musicClass: one(musicClasses, {
		fields: [enrollments.classId],
		references: [musicClasses.id]
	}),
}));

export const musicClassesRelations = relations(musicClasses, ({many}) => ({
	enrollments: many(enrollments),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({many}) => ({
	subscriptions: many(subscriptions),
}));

export const creditTransactionsRelations = relations(creditTransactions, ({one}) => ({
	subscription: one(subscriptions, {
		fields: [creditTransactions.subscriptionId],
		references: [subscriptions.id]
	}),
}));