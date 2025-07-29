"use client";

import { useState } from "react";
import {useSignUp, useUser} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {RegisteredUser} from "@/app/users/utils";
import {createUser} from "@/app/users/actions/create";

export default function OnboardingPage() {
    const { isLoaded } = useSignUp();
    const router = useRouter();

    // Form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [sobrietyDate, setSobrietyDate] = useState("");
    const [sponsor, setSponsor] = useState("");
    const [step, setStep] = useState<number>(1);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const allRequiredFields = ['firstName', 'lastName', 'phone', 'sobrietyDate', 'sponsor'];
    const formFieldHeaderStyle = "block text-sm font-medium text-gray-700";

    // Handle sign up form submission
    const handleSubmit = async (formData: FormData) => {

        if (!isLoaded) return;

        try {
            setIsLoading(true);
            setError("");
            //check required fields
            allRequiredFields.forEach((requiredField) => {
                if(!formData.get(requiredField)) {
                    setError( `${requiredField} is required`);
                    return;
                }
            });

            //create the user object
            const userData: RegisteredUser = {
                firstName: formData.get('firstName')?.toString() ?? '',
                lastName: formData.get('lastName')?.toString() ?? '',
                primaryEmailAddress: formData.get('email')?.toString() ?? '',
                phone: formData.get('phone')?.toString() ?? '',
                sobrietyDate: formData.get('sobrietyDate')?.toString() ?? '',
                sponsor: formData.get('sponsor')?.toString() ?? '',
                currentStep: formData.get('step')?.toString() ?? ''
            };
            const response = await createUser(userData);

            if (response.ok) {
                await user?.reload();
                // Redirect to dashboard after successful signup
                router.push("/");
            } else {
                throw new Error("Failed to save users metadata: " + response.errors?.join(',\n'));
            }


        } catch (err: any) {
            setError(err?.message || "An error occurred during sign up");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
            <div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create your account
                </h2>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            <form className="mt-8 space-y-6" action={handleSubmit}>
                <div className="-space-y-px rounded-md shadow-sm">
                    {/* firstName field */}
                    <div>
                        <label htmlFor="firstName" className="sr-only">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="relative block w-full rounded-t-md border-0 p-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    {/* lastName field */}
                    <div>
                        <label htmlFor="lastName" className="sr-only">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="lastName"
                            autoComplete="text"
                            required
                            className="relative block w-full border-0 p-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    {/* phone field */}
                    <div>
                        <label htmlFor="phone" className={formFieldHeaderStyle}>
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel-country-code"
                            required
                            className="relative block w-full border-0 p-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            placeholder="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {/* email field */}
                    <div>
                        <label htmlFor="email" className={formFieldHeaderStyle}>
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="relative block w-full border-0 p-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            placeholder="email"
                            value={user?.primaryEmailAddress?.toString() ?? ''}
                            readOnly
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Your recovery information</h3>

                    {/* Sobriety date field */}
                    <div>
                        <label htmlFor="sobrietyDate" className={formFieldHeaderStyle}>
                            Sobriety Date
                        </label>
                        <input
                            id="sobrietyDate"
                            name="sobrietyDate"
                            type="date"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            value={sobrietyDate}
                            onChange={(e) => setSobrietyDate(e.target.value)}
                        />
                    </div>

                    {/* Sponsor field */}
                    <div>
                        <label htmlFor="sponsor" className={formFieldHeaderStyle}>
                            Sponsor
                        </label>
                        <input
                            id="sponsor"
                            name="sponsor"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Your sponsor's name"
                            value={sponsor}
                            onChange={(e) => setSponsor(e.target.value)}
                        />
                    </div>

                    {/* Step field */}
                    <div>
                        <label htmlFor="step" className={formFieldHeaderStyle}>
                            Current Step (1-12)
                        </label>
                        <input
                            id="step"
                            name="step"
                            type="number"
                            min="1"
                            max="12"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 p-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            value={step}
                            onChange={(e) => setStep(parseInt(e.target.value) || 1)}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading || !isLoaded}
                        className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                    >
                        {isLoading ? "Creating account..." : "Sign up"}
                    </button>
                </div>
            </form>
        </div>
    );
}
