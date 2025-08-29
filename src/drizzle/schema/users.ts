import {date, numeric, pgTable, varchar} from "drizzle-orm/pg-core";
import {createdAt, updatedAt} from "@/drizzle/schema/utils";

export const UsersTable = pgTable("users", {
    id: varchar().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    birthdate: date().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 25 }).notNull().unique(),
    createdAt,
    updatedAt,
});

export const EmployeesTable = pgTable("employees", {
    userId: varchar('user_id').primaryKey().references(() => UsersTable.id),
    title: varchar({ length: 255 }).notNull(),
    createdAt,
    updatedAt,
});

export const ResidentsTable = pgTable("residents", {
    userId: varchar('user_id').primaryKey().references(() => UsersTable.id),
    sobrietyDate: date('sobriety_date').notNull(),
    sponsor: varchar({ length: 255 }),
    step: numeric('step').notNull(),
    createdAt,
    updatedAt,
});
