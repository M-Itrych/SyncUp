"use client"

import Image from "next/image";
import {useRouter} from "next/navigation";


const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    return (
        <div className="flex flex-col  bg-sky-50 dark:bg-zinc-950">
            <div className="flex items-center h-[76px] px-16 gap-2 cursor-pointer absolute top-0" onClick={() => {
                router.replace("/")
            }} >
                <Image src="/logo.png" alt="logo"  width={40} height={40} />
                <h1 className="font-bold text-2xl">SyncUp</h1>
            </div>
            <div className="flex w-full h-screen items-center ">
                <div className="flex-5/12 ">
                    {children}
                </div>
                <div className="flex-7/12 h-full hidden lg:block border-20 rounded-lg border-sky-50 dark:border-zinc-950">
                    <div className="flex items-center justify-center h-full bg-zinc-800 rounded-lg w-auto ">
                        <Image src="/auth.png" alt="auth png" width={800} height={800} />
                    </div>
                </div>
            </div>


        </div>
    );
}

export default AuthLayout;