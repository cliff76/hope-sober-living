import React from "react";
import {render, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";

import OnboardingPage from "./page";

import * as Clerk from "@clerk/nextjs";
import {UseSignUpReturn, UseUserReturn} from "@clerk/types";
import {InitialForm, SequentialForm} from "./forms";
import {handleStep1, handleStep2} from "./handlers";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

vi.mock("./forms");
vi.mock("./handlers");

describe("OnboardingPage", () => {
    const mockedInitialForm = vi.mocked(InitialForm);
    const mockedSequentialForm = vi.mocked(SequentialForm);
    const mockedHandleStep1 = vi.mocked(handleStep1);
    const mockedHandleStep2 = vi.mocked(handleStep2);

    beforeEach(() => {
        vi.clearAllMocks();
        pushMock.mockClear();
        // default clerk behavior
        vi.spyOn(Clerk, "useSignUp").mockReturnValue({ isLoaded: true } as unknown as UseSignUpReturn);
        vi.spyOn(Clerk, "useUser").mockReturnValue({ user: { id: "u1", primaryEmailAddress: "test@example.com", reload: vi.fn() } } as unknown as UseUserReturn);
    });

    it("renders InitialForm initially", () => {
        render(<OnboardingPage />);
        expect(mockedInitialForm).toHaveBeenCalled();
        expect(mockedSequentialForm).not.toHaveBeenCalled();
    });

    it("renders SequentialForm after successful step 1", async () => {
        mockedHandleStep1.mockResolvedValue(true);

        render(<OnboardingPage />);

        // Initial render should be step 1
        expect(mockedInitialForm).toHaveBeenCalledTimes(1);
        expect(mockedSequentialForm).not.toHaveBeenCalled();

        // Get the onNext prop from the first call to InitialForm
        const onNext = mockedInitialForm.mock.calls[0][0].onNext;

        // Simulate form submission
        await onNext(new FormData());

        // Wait for state update and re-render
        await waitFor(() => {
            expect(mockedSequentialForm).toHaveBeenCalledTimes(1);
        });

        // InitialForm should not have been rendered again
        expect(mockedInitialForm).toHaveBeenCalledTimes(1);
    });

    it("pushes router to '/' after successful step 2", async () => {
        // Arrange: both steps succeed
        mockedHandleStep1.mockResolvedValue(true);
        mockedHandleStep2.mockResolvedValue(true);

        render(<OnboardingPage />);

        // Advance from step 1 to step 2
        const initialOnNext = mockedInitialForm.mock.calls[0][0].onNext;
        await initialOnNext(new FormData());

        // Wait for SequentialForm to be rendered
        await waitFor(() => {
            expect(mockedSequentialForm).toHaveBeenCalledTimes(1);
        });

        // Invoke the SequentialForm onNext to complete step 2
        const sequentialOnNext = mockedSequentialForm.mock.calls[0][0].onNext;
        await sequentialOnNext(new FormData());

        // Expect router.push to have been called to go to '/'
        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/');
        });
    });
});
