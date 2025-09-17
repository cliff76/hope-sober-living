import {date, numeric, pgTable, text, varchar} from "drizzle-orm/pg-core";
import {createdAt, updatedAt} from "@/drizzle/schema/utils";
import {createId} from "@paralleldrive/cuid2";

export const UsersTable = pgTable("users", {
    id: varchar('id', { length: 30 }) // CUID2s are typically around 24-30 chars
        .primaryKey()
        .notNull()
        .$defaultFn(() => createId()),
    externalId: varchar('external_id', { length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    birthdate: date().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 25 }).notNull().unique(),
    roles: varchar({ length: 255 }).array().notNull().default([]),
    createdAt,
    updatedAt,
});

export const EmployeesTable = pgTable("employees", {
    userId: varchar('user_id', { length: 30 }).primaryKey().references(() => UsersTable.id),
    title: varchar({ length: 255 }).notNull(),
    workEmail: varchar({ length: 255 }).notNull().unique(),
    workPhoneNumber: varchar('work_phone_number', { length: 25 }).notNull().unique(),
    responsibilities: text().notNull(),
    createdAt,
    updatedAt,
});

export const ResidentsTable = pgTable("residents", {
    userId: varchar('user_id', { length: 30 }).primaryKey().references(() => UsersTable.id),
    sobrietyDate: date('sobriety_date').notNull(),
    sponsor: varchar({ length: 255 }),
    step: numeric('step').notNull(),
    createdAt,
    updatedAt,
});
