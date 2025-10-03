import {clerkClient} from "@clerk/nextjs/server";
import {db} from "@/drizzle/client";
import {ResidentsTable, UsersTable} from "@/drizzle/schema/users";
import {DEFAULT_ROLES, SaveError} from "@/utils/constants";

type DBError = Error & { code: string, constraint: string, detail: string };

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
    errors?: Array<string | SaveError>;
}

export async function updateUserRoles(userId: string, roles: string[] = DEFAULT_ROLES) {
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            roles: roles,
        },
    })
}

const fieldMap = new Map(Object.entries({
    name: 'fullName',
    email: 'primaryEmailAddress',
    phone_number: 'phone',
    sobriety_date: 'sobriety_date',
    sponsor: 'sponsor',
    step: 'currentStep'
}));

function asDuplicateError(error: DBError) : SaveError {
    const match = error.constraint.match(/[a-zA-Z0-9]+_([\w|_]+)_unique$/);
    if (match) {
        const field = match[1];
        return {
            code: 'duplicate',
            message: `A user with this ${field} already exists.`,
            field: fieldMap.get(field),
        };
    }
    return {
        code: 'duplicate',
        message: error.detail
    }
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
        const error = ((err as Error).cause as DBError) ?? err;
        if(error.cause) console.error(
            'Error creating new resident:',
            error.message,
            (error.cause as Error).message,
            (error.cause as Error).stack,
        )
        console.error('Error creating new resident:', error.stack ?? err);
        const message = error?.code === '23505' ? asDuplicateError(error) : error.message;
        return { ok: false, errors: [message] };
    }
}
