import {clerkClient} from "@clerk/nextjs/server";

export const ROLES_RESIDENT = 'resident';

const DEFAULT_ROLES = [ROLES_RESIDENT];

const usersDB = new Map<string, RegisteredUser>().set('clifton@email.com', {
    externalId: '1234567890',
    primaryEmailAddress: 'clifton@email.com',
    fullName: 'Clifton Craig',
    firstName: 'Clifton',
    lastName: 'Craig',
    emailAddresses: [
        {
            emailAddress: 'clifton@email.com',
            verified: true
        }
    ],
    phone: '123-456-7890',
});
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
};

export type RegisterUserResponse = {
    ok: boolean;
    errors?: string[];
}

export function isUserRegistered(user: RegisteredUser | null | undefined) {
    return usersDB.has(user?.primaryEmailAddress ?? '');
}

export async function updateUserRoles(userId: string, roles: string[] = DEFAULT_ROLES) {
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            roles: roles,
        },
    })
}

export async function createNewResident(user: RegisteredUser): Promise<RegisterUserResponse> {
    return Promise.resolve().then(() => {
        user.id = user.primaryEmailAddress;
        usersDB.set(user.id, user);
        console.log('Registered users', usersDB);
        return { ok: true };
    }).catch((err) => {
        return { ok: false, errors: [err.message] };
    });
}