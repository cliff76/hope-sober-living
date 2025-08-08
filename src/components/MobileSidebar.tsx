"use client"

import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import {Book, Menu, User} from "lucide-react"
import Link from "next/link"
import {menuConfig} from "@/config/MenuConfig";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

export function MobileSidebar() {
    const router = useRouter(); // Initialize the router

    const handleSignInClick = () => {
        router.push('/src/app/(clerk)/sign-in'); // Navigate to the sign-in path
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
                <Button variant="outline" size="icon" className="m-2">
                    <Book />
                </Button>
                <SignedOut>
                    <Button id="userButton" variant="outline" size="icon" onClick={handleSignInClick}
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