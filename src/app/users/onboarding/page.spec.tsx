import React from "react";
import {render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";

import OnboardingPage from "./page";

import * as Clerk from "@clerk/nextjs";
import {UseSignUpReturn, UseUserReturn} from "@clerk/types";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

describe("OnboardingPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        pushMock.mockClear();
        // default clerk behavior
        vi.spyOn(Clerk, "useSignUp").mockReturnValue({ isLoaded: true } as unknown as UseSignUpReturn);
        vi.spyOn(Clerk, "useUser").mockReturnValue({ user: { id: "u1", primaryEmailAddress: "test@example.com", reload: vi.fn() } } as unknown as UseUserReturn);
    });

    it("OnboardingPage renders initial step", () => {
        render(<OnboardingPage />);
        expect(screen.getByText("Create your account")).toBeInTheDocument();
    });
});
