import Link from "next/link";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {menuConfig} from "@/config/MenuConfig";
import {User} from "lucide-react";

export function DesktopNavigation() {
    return <nav id="desktop-nav" className="hidden md:flex container mx-auto justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-[var(--sunrise-gold)] transition-colors">
            Hope&#39;s Sober Living
        </Link>
        <div className="flex items-center">
            {menuConfig.main.map((item) => (
                <Link key={item.key} href={item.href} className="px-3 py-2 hover:text-[var(--sunrise-gold)] transition-colors flex items-center text-lg font-medium">
                    <div className="flex flex-row items-center gap-2">{item.icon}
                        {item.title}</div>
                </Link>
            ))}
            <SignedOut>
                <Link href="/src/app/(clerk)/sign-in"
                      className="px-3 py-2 hover:text-[var(--sunrise-gold)] transition-colors flex items-center">
                    <User/>
                    Sign In
                </Link>
            </SignedOut>
            <SignedIn>
                <UserButton showName/>
            </SignedIn>
        </div>
    </nav>;
}