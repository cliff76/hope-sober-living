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
    ],
    phone: '123-456-7890',
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

export async function registerUser(user: RegisteredUser): Promise<RegisterUserResponse> {
    return Promise.resolve().then(() => {
        usersDB.set(user.primaryEmailAddress, user);
        console.log('Registered users', usersDB);
        return { ok: true };
    }).catch((err) => {
        return { ok: false, errors: [err.message] };
    });
}