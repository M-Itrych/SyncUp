"use client";

import { Button } from "@/components/ui/button";
import { ThemeSelector } from "@/components/theme-selector";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const MainNavBar = () => {
    const { isSignedIn } = useUser();
    const router = useRouter();
    const { signOut } = useClerk();
    
    return (
        <div className="h-[76px] flex justify-between items-center px-4 sm:px-8 lg:px-16 w-full z-40 fixed backdrop-blur-lg bg-black/30">
            <div
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-2 font-bold select-none cursor-pointer"
            >
                <Image src="/logo.png" alt="logo" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10" />
                <h1 className="font-bold text-xl sm:text-2xl text-white">SyncUp</h1>
            </div>
            
            <div className="flex items-center justify-center gap-x-2 sm:gap-x-4">
                <Button
                    variant="log"
                    className="bg-violet-500 hover:bg-violet-500/30 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-md"
                    onClick={() => {
                        !isSignedIn ? router.push("/login") : router.push("/a");
                    }}
                >
                    {!isSignedIn ? "Log In" : "Open App"}
                </Button>
            </div>
        </div>
    );
};