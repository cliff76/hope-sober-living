import {RegisteredUser} from "@/features/users/db/users";
import {createUser, updateUser} from "@/app/users/actions/create";
import {UserResource} from "@clerk/types";
import {SaveError} from "@/utils/constants";

export async function handleStep1(userId: string, formData: FormData, roles:string[], onError: (error: string) => void) {
    const initialFormRequiredFields = ['firstName', 'lastName', 'phone', 'sobrietyDate', 'sponsor'];
    try {
        //check required fields
        initialFormRequiredFields.forEach((requiredField) => {
            if (!formData.get(requiredField)) {
                onError(`${requiredField} is required`);
                return;
            }
        });

        //create the user object
        const userData: RegisteredUser = {
            externalId: userId,
            firstName: formData.get('firstName')?.toString() ?? '',
            lastName: formData.get('lastName')?.toString() ?? '',
            primaryEmailAddress: formData.get('email')?.toString() ?? '',
            phone: formData.get('phone')?.toString() ?? '',
            sobrietyDate: formData.get('sobrietyDate')?.toString() ?? '',
            sponsor: formData.get('sponsor')?.toString() ?? '',
            currentStep: formData.get('step')?.toString() ?? ''
        };
        const response = await createUser(userData, roles);

        if (response.ok) {
            return true;
        } else {
            onError("Failed to save users metadata: " + response.errors?.map(error => (error as SaveError)?.message ?? error).join(',\n'));
            return false;
        }

    } catch (err: unknown) {
        onError((err as Error)?.message || "An error occurred during sign up");
        return false;
    }
}

export async function handleStep2(formData: FormData, onError: (error: string) => void, user?: UserResource | null): Promise<boolean> {
    try {
        if (!user) {
            onError("User is not logged in.");
            return false;
        }
        const result = await updateUser(user.id, formData);
        // Redirect to dashboard after successful signup
        if (result.ok) {
            await user?.reload();
            return true;
        } else {
            onError("Failed to update user. " + result.errors?.join(',\n'));
            return false;
        }
    } catch (e: unknown) {
        onError("Failed to update user [" + ((e as Error).message ? (e as Error).message : e) + "]");
        return false;
    }
}
