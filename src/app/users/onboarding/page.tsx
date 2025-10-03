"use client";

import {useState} from "react";
import {useSignUp, useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {InitialForm, SequentialForm} from "./forms";
import {handleStep1, handleStep2} from "./handlers";
import { SaveError } from "@/utils/constants";

export default function OnboardingPage() {
    const { isLoaded } = useSignUp();
    const router = useRouter();

    const [error, setError] = useState("");
    const [errors, setErrors] = useState<SaveError[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const [step, setStep] = useState<number>(1);

    function onError(err: string | SaveError[]) {
        if (typeof err === "string") {
            console.error(err);
            setError(err);
            setErrors([]);
        } else {
            console.error("Validation errors:", err);
            setErrors(err);
            // Optional: also set a general error message
            setError(err.map(e => e.message).join(", "));
        }
    }

    const [hasHope, setHasHope] = useState<boolean>(false);

    const handleSubmit = async (formData: FormData) => {

        if (!isLoaded) return;

        try {
            setError("");
            setErrors([]);
            setIsLoading(true);
            if(!user) {
                setError("User is not logged in!");
                setIsLoading(false);
                return;
            }
            if (step === 1) {
                const result = await handleStep1(user.id ?? '', formData, user?.publicMetadata?.roles ?? [], onError);
                setHasHope(formData.get('resident') === 'existing');
                if(result) {
                    setStep(2);
                }
            }
            if (step === 2) {
                const result = await handleStep2(formData, (e: string) => onError(e), user);
                if(result) {
                    router.push('/');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    if(step === 1)  return (
        <InitialForm user={user} isLoading={isLoading || !isLoaded} error={error} errors={errors} onNext={handleSubmit}/>
    );
    if(step === 2) return (
        <SequentialForm user={user} isLoading={isLoading || !isLoaded} error={error} hasHope={hasHope} onPrevious={() => setStep(1)} onNext={handleSubmit}/>
    )}
