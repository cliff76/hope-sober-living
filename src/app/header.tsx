import {MobileSidebar} from "@/components/MobileSidebar";
import {DesktopNavigation} from "@/components/DesktopNavigation";

export function Header() {
    return <header className="md:bg-[var(--sidebar-primary)] text-slate-800 p-4 shadow-md sticky top-0 z-50">
        <div id="mobile-sidebar" className="min-h-[4dvh] md:hidden">
            <MobileSidebar/>
        </div>
        <DesktopNavigation/>
    </header>;
}