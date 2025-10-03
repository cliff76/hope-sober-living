import {beforeEach, describe, expect, it, vi} from "vitest";

import {handleStep1, handleStep2} from "./handlers";

import * as CreateModule from "@/app/users/actions/create";
import {UserResource} from "@clerk/types";
import {CreateUserResponse} from "@/app/users/actions/create";
import {getRandomInteger} from "@/utils/utils";

vi.mock("@/app/users/actions/create");

describe("Onboarding Handlers", () => {
    const createUserMock = vi.mocked(CreateModule.createUser);
    const updateUserMock = vi.mocked(CreateModule.updateUser);
    const randomId = () => getRandomInteger(100000, 999999).toString();

    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe("handleStep1", () => {
        const formData = new FormData();
        const expectedUser = {
            "externalId": expect.any(String),
            "currentStep": "1",
            "firstName": "A",
            "lastName": "B",
            "phone": "P",
            "primaryEmailAddress": "x@y.com",
            "sobrietyDate": "2020-01-01",
            "sponsor": "S",
        };

        beforeEach(() => {
            formData.set("firstName", expectedUser.firstName);
            formData.set("lastName", expectedUser.lastName);
            formData.set("phone", expectedUser.phone);
            formData.set("sobrietyDate", expectedUser.sobrietyDate);
            formData.set("sponsor", expectedUser.sponsor);
            formData.set("email", expectedUser.primaryEmailAddress);
            formData.set("step", expectedUser.currentStep);
        })

        it("calls createUser with form data and roles", async () => {
            createUserMock.mockResolvedValueOnce({ ok: true } as unknown as CreateUserResponse);

            const onError = vi.fn();
            const roles = ["role1", "role2"];
            const result = await handleStep1(randomId(), formData, roles, onError);
            expect(result).toBe(true);
            expect(onError).not.toHaveBeenCalled();
            expect(createUserMock).toHaveBeenCalledWith(
                expectedUser,
                roles
            );
        });

        it("returns true on successful createUser", async () => {
            createUserMock.mockResolvedValueOnce({ ok: true } as unknown as CreateUserResponse);

            const onError = vi.fn();
            const result = await handleStep1(randomId(), formData, [], onError);
            expect(result).toBe(true);
            expect(onError).not.toHaveBeenCalled();
            expect(createUserMock).toHaveBeenCalled();
        });

        it("calls onError and returns false when createUser fails", async () => {
            createUserMock.mockResolvedValueOnce({ ok: false, errors: ["boom"] } as unknown as CreateUserResponse);

            const onError = vi.fn();
            const result = await handleStep1(randomId(), formData, [], onError);
            expect(result).toBe(false);
            expect(onError).toHaveBeenCalledWith(expect.stringContaining("Failed to save users metadata"));
        });

        it("handles exceptions by calling onError and returning false", async () => {
            createUserMock.mockImplementationOnce(() => { throw new Error("bad"); });

            const onError = vi.fn();
            const result = await handleStep1(randomId(), formData, [], onError);
            expect(result).toBe(false);
            expect(onError).toHaveBeenCalledWith(expect.stringContaining("bad"));
        });
    });

    describe("handleStep2", () => {
        it("returns false and calls onError when user missing", async () => {
            const onError = vi.fn();
            const fd = new FormData();
            const result = await handleStep2(fd, onError, null);
            expect(result).toBe(false);
            expect(onError).toHaveBeenCalledWith("User is not logged in.");
        });

        it("returns true and reloads user on success", async () => {
            updateUserMock.mockResolvedValueOnce({ ok: true } as unknown as CreateUserResponse);
            const mockedReload = vi.fn();
            const user = { id: "u1", reload: mockedReload } as unknown as UserResource;
            const onError = vi.fn();
            const fd = new FormData();
            const result = await handleStep2(fd, onError, user);
            expect(result).toBe(true);
            expect(mockedReload).toHaveBeenCalled();
        });

        it("calls onError and returns false when updateUser fails", async () => {
            updateUserMock.mockResolvedValueOnce({ ok: false, errors: ["nope"] } as unknown as CreateUserResponse);
            const mockedReload = vi.fn();
            const user = { id: "u1", reload: mockedReload } as unknown as UserResource;
            const onError = vi.fn();
            const fd = new FormData();
            const result = await handleStep2(fd, onError, user);
            expect(result).toBe(false);
            expect(onError).toHaveBeenCalledWith(expect.stringContaining("Failed to update user."));
        });

        it("handles thrown errors by calling onError and returning false", async () => {
            updateUserMock.mockImplementationOnce(() => { throw new Error("ohno"); });
            const mockedReload = vi.fn();
            const user = { id: "u1", reload: mockedReload } as unknown as UserResource;
            const onError = vi.fn();
            const fd = new FormData();
            const result = await handleStep2(fd, onError, user);
            expect(result).toBe(false);
        });
    });
});
