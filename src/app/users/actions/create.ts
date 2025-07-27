'use server'

import {RegisteredUser, registerUser, RegisterUserResponse} from "@/app/users/utils";
import {auth, clerkClient} from "@clerk/nextjs/server";

export type CreateUserResponse = RegisterUserResponse & {
    onboardingComplete: boolean;
}

export async function createUser(user: RegisteredUser): Promise<CreateUserResponse> {
    let authResponse;
    try {
        console.error('Fetching Clerk auth response...');
        authResponse = await auth();
    } catch (e: any) {
        console.error('Error fetching Clerk auth response ', e.message);
        return { ok: false, onboardingComplete: false, errors: ['Error fetching Clerk auth response' + e.message] }
    }
    console.error('Clerk auth response returned ', authResponse);
    const { userId } = authResponse;
    if (!userId) {
        console.error('No Logged In User');
        return { ok: false, onboardingComplete: false, errors: ['No Logged In User'] }
    }

    console.error('Registering user...');
    const response = await registerUser(user);
    try {
        console.error('Fetching Clerk client...');
        const client = await clerkClient();
        await client?.users?.updateUser(userId, {
            publicMetadata: {
                onboardingComplete: true,
            },
        })
        return {...response, onboardingComplete: true};
    } catch (e: any) {
        console.error('Error fetching Clerk client ', e.message);
        return { ok: false, onboardingComplete: false, errors: [e.message] };
    }
}