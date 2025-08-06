"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"

export function MobileSidebar() {
    return (
        <div className="md:hidden">
            <div className="fixed top-0 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="m-2">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="flex flex-col space-y-4 mt-4">
                            <Link href="/" className="text-lg font-medium">Home</Link>
                            <Link href="/about" className="text-lg font-medium">About</Link>
                            <Link href="/testimonials" className="text-lg font-medium">Testimonials</Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}