'use server'

import {RegisteredUser, registerUser, RegisterUserResponse} from "@/app/users/utils";
import {auth, clerkClient} from "@clerk/nextjs/server";

export type CreateUserResponse = RegisterUserResponse & {
    onboardingComplete: boolean;
}

export async function createUser(user: RegisteredUser): Promise<CreateUserResponse> {
    let authResponse;
    try {
        authResponse = await auth();
    } catch (e: any) {
        return { ok: false, onboardingComplete: false, errors: ['Error fetching Clerk auth response' + e.message] }
    }
    const { userId } = authResponse;
    if (!userId) {
        return { ok: false, onboardingComplete: false, errors: ['No Logged In User'] }
    }

    const response = await registerUser(user);
    try {
        const client = await clerkClient();
        await client?.users?.updateUser(userId, {
            publicMetadata: {
                onboardingComplete: true,
            },
        })
        return {...response, onboardingComplete: true};
    } catch (e: any) {
        return { ok: false, onboardingComplete: false, errors: [e.message] };
    }
}