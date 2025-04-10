import {MainNavBar} from "@/components/navigation/main-nav-bar";

export default function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="h-full relative">
            <MainNavBar />
            {children}
        </div>

    )
}