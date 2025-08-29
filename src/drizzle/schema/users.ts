import {date, pgTable, varchar} from "drizzle-orm/pg-core";
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
