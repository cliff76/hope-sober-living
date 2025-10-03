"use client";

import {useState} from "react";
import {UserResource} from "@clerk/types";
import {Button} from "@/components/ui/button";
import {ChevronLeft} from "lucide-react";
import {RequiredCheckbox} from "@/components/requiredCheckbox";

type InitialFormProps = {
    isLoading?: boolean,
    user?: UserResource | null | undefined,
    error?: string,
    onNext: (formData: FormData) => Promise<void>,
};

type SequentialFormProps = InitialFormProps & {hasHope: boolean, onPrevious: () => void};

const formFieldHeaderStyle = "block text-sm font-medium text-gray-700";

export function InitialForm({isLoading, user, error, onNext} : InitialFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [sobrietyDate, setSobrietyDate] = useState("");
    const [sponsor, setSponsor] = useState("");
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [resident, setResident] = useState<"new" | "existing">("new");


    return <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                Create your account
            </h2>
        </div>

        {error && (
            <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700 max-w-xs max-h-40 overflow-auto break-words">{error}</div>
            </div>
        )}

        <form className="mt-8 space-y-6" action={onNext}>
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
                        value={currentStep}
                        onChange={(e) => setCurrentStep(parseInt(e.target.value) || 1)}
                    />
                </div>
            </div>

            {/* NEW: Hope radio buttons at the bottom of the form */}
            <div className="mt-4">
                <fieldset>
                    <legend className="text-sm font-medium text-gray-700">Hope</legend>
                    <div className="mt-2 flex flex-col gap-4">
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="radio"
                                name="resident"
                                value="new"
                                checked={resident === "new"}
                                onChange={() => setResident("new")}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">New Resident (I need Hope)</span>
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="radio"
                                name="resident"
                                value="existing"
                                checked={resident === "existing"}
                                onChange={() => setResident("existing")}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Existing Resident (I have Hope)</span>
                        </label>
                    </div>
                </fieldset>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                >
                    {isLoading ? "Creating account..." : "Next"}
                </button>
            </div>
        </form>
    </div>;
}

export function SequentialForm({isLoading, error, hasHope, onPrevious, onNext} : SequentialFormProps) {
    const [danger, setDanger] = useState<"yes" | "no" | "">("");
    const [dangerDetails, setDangerDetails] = useState<string>("");
    const [admitAlcoholic, setAdmitAlcoholic] = useState(hasHope);
    const [committedToRecovery, setCommittedToRecovery] = useState(hasHope);
    const [sober72Hours, setSober72Hours] = useState(hasHope);
    const [commit30Days, setCommit30Days] = useState(hasHope);
    const [followHouseRules, setFollowHouseRules] = useState(hasHope);
    const [becomeMember, setBecomeMember] = useState(hasHope);
    const [noSexCrimes, setNoSexCrimes] = useState(hasHope);
    const [acceptAll, setAcceptAll] = useState(hasHope);

    // Keep checkboxes in sync when Accept All toggled
    const toggleAcceptAll = (checked: boolean) => {
        setAcceptAll(checked);
        setAdmitAlcoholic(checked);
        setCommittedToRecovery(checked);
        setSober72Hours(checked);
        setCommit30Days(checked);
        setFollowHouseRules(checked);
        setBecomeMember(checked);
        setNoSexCrimes(checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Build FormData so onNext signature is respected
        const formData = new FormData();
        formData.set("danger", danger);
        formData.set("admitAlcoholic", String(admitAlcoholic));
        formData.set("committedToRecovery", String(committedToRecovery));
        formData.set("sober72Hours", String(sober72Hours));
        formData.set("commit30Days", String(commit30Days));
        formData.set("followHouseRules", String(followHouseRules));
        formData.set("becomeMember", String(becomeMember));
        formData.set("noSexCrimes", String(noSexCrimes));
        formData.set("acceptAll", String(acceptAll));

        await onNext(formData);
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-row items-center mb-6">
            <Button data-testid="previous-button" variant="outline" size="icon" onClick={onPrevious} className="mr-4">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Button>
            <span className="ml-4 text-center text-3xl font-bold tracking-tight text-gray-900">Questionnaire</span>
        </div>

        {error && (
            <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
                <fieldset>
                    <legend className="text-sm font-medium text-gray-700">Are you in any danger?</legend>
                    <div className="mt-2 flex items-center gap-6">
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="radio"
                                name="danger"
                                value="yes"
                                checked={danger === "yes"}
                                onChange={() => setDanger("yes")}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                required
                            />
                            <span className="text-sm text-gray-700">Yes</span>
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="radio"
                                name="danger"
                                value="no"
                                checked={danger === "no"}
                                onChange={() => setDanger("no")}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">No</span>
                        </label>
                    </div>
                    {danger === "yes" && <div>
                        <label htmlFor="dangerDetails" className={formFieldHeaderStyle}>
                            Explain your situation
                        </label>
                        <textarea
                            id="dangerDetails"
                            name="dangerDetails"
                            rows={3}
                            required
                            className="relative block w-full rounded-md border-0 p-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                            placeholder="Eg. Urgent need of shelter, domestic situation, etc."
                            value={dangerDetails}
                            onChange={(e) => setDangerDetails(e.target.value)}
                        />
                    </div>}
                </fieldset>

                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {hasHope ? "Update" : "Complete"} your Agreement
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Please accept all of the following terms.
                    </p>
                </div>
                <fieldset>
                    <legend className="text-sm font-medium text-gray-700">Agreements</legend>
                    <div className="mt-2 flex flex-col gap-3">
                        <label className="inline-flex items-center space-x-2">
                            <RequiredCheckbox
                                name="admitAlcoholic"
                                label="I admit I am an alcoholic/addict"
                                checked={admitAlcoholic}
                                onChange={(e) => { setAdmitAlcoholic(e.target.checked); if(!e.target.checked) setAcceptAll(false); }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                invalidMessage="Please agree to each of the terms."
                                required
                            />
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RequiredCheckbox
                                name="committedToRecovery"
                                label="I am committed to my recovery"
                                checked={committedToRecovery}
                                onChange={(e) => { setCommittedToRecovery(e.target.checked); if(!e.target.checked) setAcceptAll(false); }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                invalidMessage="Please agree to each of the terms."
                                required
                            />
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RequiredCheckbox
                                name="sober72Hours"
                                label="I have been sober at least 72 hours"
                                checked={sober72Hours}
                                onChange={(e) => { setSober72Hours(e.target.checked); if(!e.target.checked) setAcceptAll(false); }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                invalidMessage="Please agree to each of the terms."
                                required
                            />
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RequiredCheckbox
                                name="commit30Days"
                                label="I commit to at least 30 days"
                                checked={commit30Days}
                                onChange={(e) => { setCommit30Days(e.target.checked); if(!e.target.checked) setAcceptAll(false); }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                invalidMessage="Please agree to each of the terms."
                                required
                            />
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RequiredCheckbox
                                label="I am willing to follow house rules"
                                name="followHouseRules"
                                checked={followHouseRules}
                                onChange={(e) => { setFollowHouseRules(e.target.checked); if(!e.target.checked) setAcceptAll(false); }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                invalidMessage="Please agree to each of the terms."
                                required
                            />
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RequiredCheckbox
                                name="becomeMember"
                                label="I am willing to become a member of the Hope family"
                                checked={becomeMember}
                                onChange={(e) => { setBecomeMember(e.target.checked); if(!e.target.checked) setAcceptAll(false); }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                invalidMessage="Please agree to each of the terms."
                                required
                            />
                        </label>

                        <label className="inline-flex items-center space-x-2">
                            <RequiredCheckbox
                                name="noSexCrimes"
                                label="I have no history of sex crimes"
                                checked={noSexCrimes}
                                onChange={(e) => { setNoSexCrimes(e.target.checked); if(!e.target.checked) setAcceptAll(false); }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                invalidMessage="Please agree to each of the terms."
                                required
                            />
                        </label>

                        <label className="inline-flex items-center space-x-2 mt-2">
                            <input
                                type="checkbox"
                                name="acceptAll"
                                checked={acceptAll}
                                onChange={(e) => toggleAcceptAll(e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm font-medium text-gray-900">Accept All</span>
                        </label>
                    </div>
                </fieldset>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                >
                    {isLoading ? "Saving..." : "Done"}
                </button>
            </div>
        </form>
    </div>;
}
