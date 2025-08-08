"use client"

import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import {Book, Menu, User} from "lucide-react"
import Link from "next/link"
import {menuConfig} from "@/config/MenuConfig";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {usePathname, useRouter} from "next/navigation";

const BUTTON_SIGN_IN = 'sign-in';

const BUTTON_ABOUT = 'about';

export function MobileSidebar() {
    const router = useRouter(); // Initialize the router
    const pathname = usePathname();

    const handleSignInClick = (button: string) => {
        if (button === BUTTON_SIGN_IN) {
            router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname)}`);
        } else if (button === BUTTON_ABOUT) {
            router.push('/about');
        }
    };

    return (
        <div className="md:hidden">
            <div className="fixed flex px-2 items-center top-0 z-50 bg-white/75 rounded-xl shadow-xl m-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="m-2">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Mobile navigation menu</SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col space-y-4 mt-4">
                            {menuConfig.main.map((item) => (
                                <Link key={item.key} href={item.href} className="text-lg font-medium">
                                    <div className="flex flex-row items-center gap-2">{item.icon}
                                        {item.title}</div>
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <Button variant="outline" size="icon" className="m-2" onClick={() => handleSignInClick(BUTTON_ABOUT)}>
                    <Book/>
                </Button>
                <SignedOut>
                    <Button id="userButton" variant="outline" size="icon" onClick={() => handleSignInClick(BUTTON_SIGN_IN)}
                          className="m-2">
                        <User/>
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </div>
        </div>
    )
}