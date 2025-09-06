'use server'

import {RegisteredUser, registerUser, RegisterUserResponse} from "@/features/users/db/users";
import {auth, clerkClient} from "@clerk/nextjs/server";

export type CreateUserResponse = RegisterUserResponse

export async function createUser(user: RegisteredUser): Promise<CreateUserResponse> {
    let authResponse;
    try {
        authResponse = await auth();
    } catch (e: unknown) {
        return { ok: false, errors: ['Error fetching Clerk auth response' + (e as Error).message] }
    }
    const { userId } = authResponse;
    if (!userId) {
        return { ok: false, errors: ['No Logged In User'] }
    }

    return await registerUser(user);
}

export async function updateUser(clientUserId: string, info: FormData): Promise<CreateUserResponse> {
    const errors = [];
    const { userId } = await auth();
    if(userId !== clientUserId) {
        const error = `User ID mismatch. The result from useUser() is ${clientUserId}, but auth() userId is ${userId}.`;
        console.error(error);
        errors.push(error);
    }
    console.log('Updating user with form data ', info);

    const client = await clerkClient();
    await client?.users?.updateUser(clientUserId, {
        publicMetadata: {
            onboardingComplete: true,
        },
    });
    return { ok: true, errors: errors };
}