import {AppNavBar} from "@/components/navigation/app-nav-bar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen w-screen bg-white dark:bg-zinc-800">
            <div className="hidden md:!flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <AppNavBar />
            </div>
            <main className="md:pl-[72px] h-full">{children}</main>
        </div>
    );
}

export default AppLayout;