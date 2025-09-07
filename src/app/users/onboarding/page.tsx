"use client";

import {useState} from "react";
import {useSignUp, useUser} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import {InitialForm, SequentialForm} from "./forms";
import {handleStep1, handleStep2} from "./handlers";


export default function OnboardingPage() {
    const { isLoaded } = useSignUp();
    const router = useRouter();

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const [step, setStep] = useState<number>(1);

    function onError(error: string) {
        console.error(error);
        setError(error);
    }

    const [hasHope, setHasHope] = useState<boolean>(false);

    const handleSubmit = async (formData: FormData) => {

        if (!isLoaded) return;

        try {
            setError("");
            setIsLoading(true);
            if (step === 1) {
                const result = await handleStep1(formData, user?.publicMetadata?.roles ?? [], onError);
                setHasHope(formData.get('resident') === 'existing');
                if(result) {
                    setStep(2);
                }
            }
            if (step === 2) {
                const result = await handleStep2(formData, onError, user);
                if(result) {
                    router.push('/');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    if(step === 1)  return (
        <InitialForm user={user} isLoading={isLoading || !isLoaded} error={error} onNext={handleSubmit}/>
    );
    if(step === 2) return (
        <SequentialForm user={user} isLoading={isLoading || !isLoaded} error={error} hasHope={hasHope} onPrevious={() => setStep(1)} onNext={handleSubmit}/>
    )}
