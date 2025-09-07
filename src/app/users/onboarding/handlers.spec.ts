import {beforeEach, describe, expect, it, vi} from "vitest";

import {handleStep1, handleStep2} from "./handlers";

import * as CreateModule from "@/app/users/actions/create";
import {UserResource} from "@clerk/types";
import {CreateUserResponse} from "@/app/users/actions/create";

vi.mock("@/app/users/actions/create");

describe("Onboarding Handlers", () => {
    const createUserMock = vi.mocked(CreateModule.createUser);
    const updateUserMock = vi.mocked(CreateModule.updateUser);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("handleStep1", () => {
        it("returns true on successful createUser", async () => {
            createUserMock.mockResolvedValueOnce({ ok: true } as unknown as CreateUserResponse);
            const fd = new FormData();
            fd.set("firstName", "A");
            fd.set("lastName", "B");
            fd.set("phone", "P");
            fd.set("sobrietyDate", "2020-01-01");
            fd.set("sponsor", "S");
            fd.set("email", "x@y.com");
            fd.set("step", "1");

            const onError = vi.fn();
            const result = await handleStep1(fd, [], onError);
            expect(result).toBe(true);
            expect(onError).not.toHaveBeenCalled();
            expect(createUserMock).toHaveBeenCalled();
        });

        it("calls onError and returns false when createUser fails", async () => {
            createUserMock.mockResolvedValueOnce({ ok: false, errors: ["boom"] } as unknown as CreateUserResponse);
            const fd = new FormData();
            fd.set("firstName", "A");
            fd.set("lastName", "B");
            fd.set("phone", "P");
            fd.set("sobrietyDate", "2020-01-01");
            fd.set("sponsor", "S");
            fd.set("email", "x@y.com");
            fd.set("step", "1");

            const onError = vi.fn();
            const result = await handleStep1(fd, [], onError);
            expect(result).toBe(false);
            expect(onError).toHaveBeenCalledWith(expect.stringContaining("Failed to save users metadata"));
        });

        it("handles exceptions by calling onError and returning false", async () => {
            createUserMock.mockImplementationOnce(() => { throw new Error("bad"); });
            const fd = new FormData();
            fd.set("firstName", "A");
            fd.set("lastName", "B");
            fd.set("phone", "P");
            fd.set("sobrietyDate", "2020-01-01");
            fd.set("sponsor", "S");
            fd.set("email", "x@y.com");
            fd.set("step", "1");

            const onError = vi.fn();
            const result = await handleStep1(fd, [], onError);
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
