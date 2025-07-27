const usersDB = new Map<string, RegisteredUser>().set('clifton@email.com', {
    primaryEmailAddress: 'clifton@email.com',
    fullName: 'Clifton Craig',
    firstName: 'Clifton',
    lastName: 'Craig',
    emailAddresses: [
        {
            emailAddress: 'clifton@email.com',
            verified: true
        }
    ]
});
export type RegisteredUser = {
    primaryEmailAddress: string;
    fullName?: string;
    firstName: string;
    lastName: string;
    emailAddresses?: {
        emailAddress: string;
        verified: boolean;
    }[];
    sobrietyDate?: string;
    sponsor?: string;
};

export type RegisterUserResponse = {
    ok: boolean;
    errors?: string[];
}

export function isUserRegistered(user: RegisteredUser | null | undefined) {
    return usersDB.has(user?.primaryEmailAddress ?? '');
}

export async function registerUser(user: RegisteredUser): Promise<RegisterUserResponse> {
    return Promise.resolve().then(() => {
        usersDB.set(user.primaryEmailAddress, user);
        return { ok: true };
    }).catch((err) => {
        console.error('Error registering user ', err);
        return { ok: false, errors: [err.message] };
    });
}