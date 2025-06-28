// This creates the About Us page.
// The header and footer are provided by layout.tsx.

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

function Member() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-[var(--accent-green)] mb-8 text-center">
                Hope&apos;s Sober Living Members
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto text-slate-700">
                <p className="mb-4 text-lg">
                    Your Member info will show here.
                </p>
                <LoginButton />
            </div>
        </div>
    );
}

export default function MemberPage() {
    return <Member />;
}
