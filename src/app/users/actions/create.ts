'use server'

import {
    RegisteredUser,
    createNewResident,
    RegisterUserResponse,
    updateUserRoles,
    ROLES_RESIDENT
} from "@/features/users/db/users";
import {auth, clerkClient} from "@clerk/nextjs/server";

export type CreateUserResponse = RegisterUserResponse

export async function createUser(user: RegisteredUser, roles: string []): Promise<CreateUserResponse> {
    if(!roles || roles.length === 0) {
        updateUserRoles(user.externalId)
        return await createNewResident(user);
    }
    if(roles.includes(ROLES_RESIDENT))
        return await createNewResident(user);

    throw new Error('Unsupported roles [' + roles.join(', ' + ']'));
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