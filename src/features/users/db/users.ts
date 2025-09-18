import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/client";
import { UsersTable, ResidentsTable } from "@/drizzle/schema/users";

export const ROLES_ADMIN = 'admin';
export const ROLES_EMPLOYEE = 'employee';
export const ROLES_RESIDENT = 'resident';

const DEFAULT_ROLES = [ROLES_RESIDENT];

export type RegisteredUser = {
    id?: string;
    externalId: string;
    primaryEmailAddress: string;
    fullName?: string;
    firstName: string;
    lastName: string;
    emailAddresses?: {
        emailAddress: string;
        verified: boolean;
    }[];
    phone: string;
    sobrietyDate?: string;
    sponsor?: string;
    currentStep?: string;
    // allow birthdate if provided (schema requires it)
    birthdate?: string | Date;
};

export type RegisterUserResponse = {
    ok: boolean;
    errors?: string[];
}

export async function updateUserRoles(userId: string, roles: string[] = DEFAULT_ROLES) {
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            roles: roles,
        },
    })
}

/**
 * Persist a new resident into the Users and Residents tables.
 * The function will:
 *  - determine a stable user id
 *  - insert a record into users table
 *  - insert a corresponding record into residents table
 *  - keep the in-memory usersDB in sync
 */
export async function createNewResident(user: RegisteredUser): Promise<RegisterUserResponse> {
    try {

        // Map incoming data into users table columns
        const name = (user.fullName ?? `${user.firstName} ${user.lastName}`).trim();
        // Format birthdate as 'YYYY-MM-DD' string for the database
        const formatDate = (date: Date | string) => {
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };
        const externalId = user.externalId;
        const birthdate = user.birthdate ? formatDate(user.birthdate) : formatDate(new Date());
        const email = user.primaryEmailAddress;
        const phoneNumber = user.phone;
        const roles = DEFAULT_ROLES;

        // Insert into UsersTable
        const insertedUser = await db.insert(UsersTable).values({
            externalId,
            name,
            birthdate,
            email,
            phoneNumber,
            roles,
        }).returning();

        // Map incoming data into residents table columns
        const sobrietyDate = formatDate(user.sobrietyDate ?? new Date());
        const sponsor = user.sponsor ?? null;
        const step = user.currentStep ?? '1';

        // Insert into ResidentsTable
        await db.insert(ResidentsTable).values({
            userId: insertedUser[0].id,
            sobrietyDate,
            sponsor,
            step
        });

        return { ok: true };
    } catch (err: unknown) {
        console.error('Error creating new resident:', (err as Error).stack ?? err);
        return { ok: false, errors: [(err as Error).message] };
    }
}
