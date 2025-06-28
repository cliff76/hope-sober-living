import Image from "next/image";
import {Slideshow} from "@/components/slideshow";
import {auth0} from "@/lib/auth0";
import {SessionData} from "@auth0/nextjs-auth0/types";

interface LoggedInProps {
    session?: SessionData | null
}

function LoggedIn({session}: LoggedInProps) {
  // If no session, show sign-up and login buttons
  if (!session) {
    return (
        <div>
          <div><a href="/auth/login?screen_hint=signup">
            <button>Sign up</button>
          </a></div>
          <div><a href="/auth/login">
            <button>Log in</button>
          </a></div>
        </div>
    );
  }

  // If session exists, show a welcome message and logout button
  return (
      <main>
        <h1>Welcome, {session.user.name}!</h1>
        <p>
          <a href="/auth/logout">
            <button>Log out</button>
          </a>
        </p>
      </main>
  );
}

export default async function Home() {
    // Fetch the user session
    const session = await auth0.getSession();

    return (
        <>
            {/* Background Image Slideshow */}
            <Slideshow/>

            {/* Main Page Content */}
            {/* Added 'relative' and 'z-0' to ensure it's above the -z-10 background */}
            {/* Added a semi-transparent background to the content box for better readability */}
            <div className="container mx-auto p-8 flex flex-col items-center text-center relative z-0">
                <div className="bg-white/75 dark:bg-slate-800/75 p-6 sm:p-10 rounded-xl shadow-xl">
                    <div className="my-6 sm:my-10">
                        <Image
                            src="/HopeLogo.png" // Ensure HopeLogo.png is in the public folder
                            alt="Hope's Sober Living Logo"
                            width={200} // Adjusted size
                            height={200} // Adjusted size
                            priority
                            className="rounded-lg shadow-lg mx-auto"
                        />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">
                        There is always Hope...
                    </h1>
                    <p className="text-md sm:text-lg text-slate-700 dark:text-stone-300 mb-4 max-w-2xl">
                        A supportive and safe environment dedicated to helping individuals on their journey to recovery.
                        We provide a structured and caring home to foster growth, healing, and a new beginning.
                    </p>
                    <p className="text-md sm:text-lg text-slate-700 dark:text-stone-300 max-w-2xl">
                        Discover a place where hope is restored and futures are rebuilt.
                    </p>
                    <LoggedIn session={session}/>
                </div>
            </div>
        </>
    );
}
