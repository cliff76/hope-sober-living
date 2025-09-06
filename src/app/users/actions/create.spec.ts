import {describe, it, expect, vi, beforeEach, afterEach, Mock} from 'vitest';
import { createUser, updateUser } from './create';
import type { RegisteredUser } from '@/features/users/db/users';
import * as utilsModule from '@/features/users/db/users';
import * as clerkModule from '@clerk/nextjs/server';

vi.mock('@/features/users/db/users', async () => {
  // import the real module so types and other exports remain intact
  const actual = await vi.importActual<typeof import('@/features/users/db/users')>('@/features/users/db/users');
  return {
    ...actual,
    registerUser: vi.fn(),
  };
});

vi.mock('@clerk/nextjs/server', () => {
  return {
    auth: vi.fn(),
    clerkClient: vi.fn(),
  };
});

describe('createUser and updateUser', () => {
  const mockedRegisterUser = utilsModule.registerUser as Mock;
  const mockedAuth = clerkModule.auth as unknown as Mock;
  const mockedClerkClient = clerkModule.clerkClient as Mock;

  const sampleUser: RegisteredUser = {
    primaryEmailAddress: 'test@example.com',
    fullName: 'Test User',
    firstName: 'Test',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'test@example.com', verified: true }],
    phone: '000-000-0000',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

    describe('createUser', () => {
        it('returns error when auth throws', async () => {
            mockedAuth.mockRejectedValue(new Error('clerk fail'));
            const result = await createUser(sampleUser);
            expect(result.ok).toBe(false);
            expect(result.errors).toEqual(['Error fetching Clerk auth responseclerk fail']);
        });

        it('returns error when no userId', async () => {
            mockedAuth.mockResolvedValue({}); // no userId
            const result = await createUser(sampleUser);
            expect(result).toEqual({ ok: false, errors: ['No Logged In User'] });
        });

        it('returns registerUser result on success (ok true)', async () => {
            mockedAuth.mockResolvedValue({ userId: 'abc' });
            mockedRegisterUser.mockResolvedValue({ ok: true });
            const result = await createUser(sampleUser);
            expect(result).toEqual({ ok: true });
            expect(mockedRegisterUser).toHaveBeenCalledWith(sampleUser);
        });

        it('returns registerUser failure result (ok false)', async () => {
            mockedAuth.mockResolvedValue({ userId: 'abc' });
            mockedRegisterUser.mockResolvedValue({ ok: false, errors: ['db error'] });
            const result = await createUser(sampleUser);
            expect(result).toEqual({ ok: false, errors: ['db error'] });
            expect(mockedRegisterUser).toHaveBeenCalledWith(sampleUser);
        });
    });

    describe('updateUser', () => {
        it('succeeds when userId matches and clerkClient updateUser is called', async () => {
            const clientUserId = 'user1';
            const updateUserMock = vi.fn().mockResolvedValue({});
            mockedAuth.mockResolvedValue({ userId: clientUserId });
            mockedClerkClient.mockResolvedValue({ users: { updateUser: updateUserMock } });

            const form = new FormData();
            form.append('x', 'y');

            const result = await updateUser(clientUserId, form);
            expect(result.ok).toBe(true);
            expect(result.errors).toEqual([]);
            expect(updateUserMock).toHaveBeenCalledTimes(1);
            expect(updateUserMock).toHaveBeenCalledWith(clientUserId, {
                publicMetadata: {
                    onboardingComplete: true,
                },
            });
        });

        it('records error when userId mismatches and still calls updateUser', async () => {
            const clientUserId = 'clientId';
            const authUserId = 'authId';
            const updateUserMock = vi.fn().mockResolvedValue({});
            mockedAuth.mockResolvedValue({ userId: authUserId });
            mockedClerkClient.mockResolvedValue({ users: { updateUser: updateUserMock } });

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const form = new FormData();
            form.append('a', 'b');

            const result = await updateUser(clientUserId, form);

            const expectedError = `User ID mismatch. The result from useUser() is ${clientUserId}, but auth() userId is ${authUserId}.`;
            expect(consoleErrorSpy).toHaveBeenCalledWith(expectedError);
            expect(result.ok).toBe(true);
            expect(result.errors).toContain(expectedError);
            expect(updateUserMock).toHaveBeenCalledWith(clientUserId, {
                publicMetadata: {
                    onboardingComplete: true,
                },
            });
        });

        it('handles undefined clerkClient without throwing', async () => {
            const clientUserId = 'userX';
            mockedAuth.mockResolvedValue({ userId: clientUserId });
            mockedClerkClient.mockResolvedValue(undefined); // no client returned

            const form = new FormData();
            form.append('k', 'v');

            const result = await updateUser(clientUserId, form);
            expect(result).toEqual({ ok: true, errors: [] });
            // nothing to assert on updateUser call because client is undefined
        });
    });
});
