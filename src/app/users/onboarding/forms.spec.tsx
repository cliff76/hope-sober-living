import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {beforeEach, describe, expect, it, vi} from "vitest";

import {InitialForm, SequentialForm} from "./forms";

import * as Clerk from "@clerk/nextjs";
import {UserResource, UseUserReturn} from "@clerk/types";
import {RequiredCheckbox} from "@/components/requiredCheckbox";

describe("Onboarding Forms", () => {
    const onNext = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // stub window.scrollTo used in SequentialForm
        window.scrollTo = vi.fn();
        // default clerk behavior
        vi.spyOn(Clerk, "useUser").mockReturnValue({ user: { id: "u1", primaryEmailAddress: "test@example.com", reload: vi.fn() } } as unknown as UseUserReturn);
    });

    it("RequiredCheckbox calls onChange and manages validity", async () => {
        const onChange = vi.fn();
        render(<RequiredCheckbox name="agree" label="Agree" invalidMessage="please agree" required={true} checked={false} onChange={onChange} />);

        const checkbox = screen.getByLabelText("Agree") as HTMLInputElement;
        expect(checkbox).toBeInTheDocument();
        await userEvent.click(checkbox);
        expect(onChange).toHaveBeenCalled();

        // When unchecked, invalid event should set validation message
        fireEvent.invalid(checkbox);
        expect(checkbox.validationMessage).toBe("please agree");

        // When checked, validation message should clear
        render(<RequiredCheckbox name="agree2" label="Agree2" invalidMessage="msg" required={true} checked={true} onChange={() => {}} />);
        const checkbox2 = screen.getByLabelText("Agree2") as HTMLInputElement;
        fireEvent.invalid(checkbox2);
        expect(checkbox2.validationMessage).toBe("");
    });

    it("renders fields and shows the given error text", async () => {
        render(<InitialForm isLoading={false} user={{primaryEmailAddress: "hello@x.com"} as unknown as UserResource} error="oh no" onNext={onNext} />);

        expect(screen.getByText("Create your account")).toBeInTheDocument();
        expect(screen.getByText("oh no")).toBeInTheDocument();

        const firstName = screen.getByPlaceholderText("First Name") as HTMLInputElement;
        const lastName = screen.getByPlaceholderText("Last Name") as HTMLInputElement;
        const phone = screen.getByPlaceholderText("phone") as HTMLInputElement;
        const sobriety = screen.getByLabelText("Sobriety Date") as HTMLInputElement;
        const sponsor = screen.getByPlaceholderText("Your sponsor's name") as HTMLInputElement;

        await userEvent.type(firstName, "A");
        await userEvent.type(lastName, "B");
        await userEvent.type(phone, "123");
        await userEvent.type(sponsor, "Sam");
        // date input: set value directly
        fireEvent.change(sobriety, { target: { value: "2020-01-01" } });

        expect(firstName.value).toBe("A");
        expect(lastName.value).toBe("B");
        expect(phone.value).toBe("123");
        expect(sobriety.value).toBe("2020-01-01");
        expect(sponsor.value).toBe("Sam");

    });

    it("Disables the create account button when isLoading is true", () => {
        // when isLoading true, the create account button is disabled and shows Creating account...
        render(<InitialForm isLoading={true} user={{ primaryEmailAddress: "hello@x.com" } as unknown as UserResource} error={""} onNext={onNext} />);
        const btn = screen.getByRole("button", { name: /Creating account.../i }) as HTMLButtonElement;
        expect(btn).toBeDisabled();
    });

    it("SequentialForm toggles Accept All and submits form", async () => {
        const onPrevious = vi.fn();
        const onNext = vi.fn(async () => { /* no-op */ });

        render(<SequentialForm isLoading={false} error={""} hasHope={false} onPrevious={onPrevious} onNext={onNext} />);

        expect(screen.getByText("Questionnaire")).toBeInTheDocument();

        const acceptAll = screen.getByRole("checkbox", { name: /Accept All/i }) as HTMLInputElement;
        expect(acceptAll).toBeInTheDocument();

        // click accept all -> should cause other checkboxes to become checked (they are rendered as inputs within labels)
        await userEvent.click(acceptAll);
        // look for one of the RequiredCheckbox labels and ensure the underlying checkbox is checked
        const admit = screen.getByLabelText("I admit I am an alcoholic/addict") as HTMLInputElement;
        expect(admit.checked).toBe(true);

        // choose danger yes to reveal textarea
        const yesRadio = screen.getByRole("radio", { name: /Yes/i }) as HTMLInputElement;
        await userEvent.click(yesRadio);
        const details = screen.getByPlaceholderText("Eg. Urgent need of shelter, domestic situation, etc.") as HTMLTextAreaElement;
        await userEvent.type(details, "I need help");

        // submit form
        const doneBtn = screen.getByRole("button", { name: /Done/i }) as HTMLButtonElement;
        await userEvent.click(doneBtn);

        await waitFor(() => {
            expect(onNext).toHaveBeenCalled();
            const fd = onNext.mock.calls[0].pop() as unknown as FormData;
            expect(fd.get("admitAlcoholic")).toBe("true");
            expect(fd.get("acceptAll")).toBe("true");
            expect(fd.get("danger")).toBe("yes");
        });

        // previous button triggers onPrevious
        expect(screen.getByTestId("previous-button")).toBeInTheDocument()
        expect(onPrevious).toBeDefined();
    });
});
