'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center">
            <SignUp.Root>
                <SignUp.Step
                    name="start"
                    className="rounded-2xl p-10 shadow-sm flex gap-6 flex-col bg-white dark:bg-zinc-900"
                >
                    <h1 className="text-6xl font-semibold dark:text-zinc-300 text-black/70 text-left">Sign up</h1>
                    <h2 className="text-lg dark:text-zinc-300 text-black/50 text-left w-sm">Sing up and connect to other communities or create your own!</h2>
                    <span></span>
                    <Clerk.Field name="emailAddress" className="flex gap-3 flex-col">
                        <Clerk.Label htmlFor="email" className="text-md font-semibold dark:text-zinc-300 text-black/70">Email</Clerk.Label>
                        <Clerk.Input type="email" placeholder="your@email.com" className="w-full rounded-3xl border border-zinc-500/50 gap-1 font-semibold text-start p-4 cursor-pointer" />
                        <Clerk.FieldError className="block text-red-500 text-xs"/>
                    </Clerk.Field>
                    <Clerk.Field name="password" className="flex gap-3 flex-col">
                        <Clerk.Label htmlFor="password" className="text-md font-semibold dark:text-zinc-300 text-black/70 ">Password</Clerk.Label>
                        <Clerk.Input type="password" placeholder="********"  className="w-full rounded-3xl border border-zinc-500/50 gap-1 font-semibold text-start p-4 cursor-pointer"/>
                        <Clerk.FieldError className="block text-red-500 text-xs" />
                    </Clerk.Field>
                    <SignUp.Action submit
                                   className="w-full rounded-3xl p-4 text-center text-md font-medium dark:text-black text-white shadow cursor-pointer dark:bg-white bg-zinc-950"
                    >
                        Sign up
                    </SignUp.Action>
                    <span className="flex w-full justify-center items-center px-6">
                            <span className="w-full h-[2px] bg-zinc-700 rounded-full z-10" />
                            <span className="z-20 px-4 ">Or</span>
                            <span className="w-full h-[2px] bg-zinc-700 rounded-full z-10" />
                    </span>
                    <div className="grid grid-cols-2 gap-x-2">
                        <Clerk.Connection
                            name="google"
                            className="flex items-center gap-x-3 justify-center font-medium  shadow-sm py-4 px-2.5 cursor-pointer  rounded-full bg-zinc-500/20"
                        >
                            Google
                        </Clerk.Connection>
                        <Clerk.Connection
                            name="github"
                            className="flex items-center gap-x-3 justify-center font-medium r shadow-sm py-1.5 px-2.5 rounded-full bg-zinc-500/20 cursor-pointer"
                        >
                            GitHub
                        </Clerk.Connection>
                    </div>
                    <div className="flex items-center gap-2 h-full  rounded-full z-10">
                        <p>Already have an account?</p>
                        <Clerk.Link navigate="sign-in" className="text-violet-500 cursor-pointer">Sign in</Clerk.Link>
                    </div>
                </SignUp.Step>
                <SignUp.Step name="verifications">
                    <SignUp.Strategy name="email_code">
                    <div className="rounded-2xl p-10 shadow-sm flex gap-6 flex-col">
                        <h1 className="text-6xl font-semibold text-zinc-300 text-left w-sm">Check <br />your email</h1>
                        <span />

                        <Clerk.Field name="code" className="flex items-center gap-5">
                            <Clerk.Label className=" flex-1/2 text-xl font-semibold text-zinc-300 text-center">
                                Verification Code:
                            </Clerk.Label>
                                <Clerk.Input className="flex-1/2 rounded-3xl border border-zinc-500/50 gap-1 font-semibold text-start p-4 cursor-pointer text-xl"/>
                            <Clerk.FieldError />
                        </Clerk.Field>
                        <SignUp.Action submit className="w-full rounded-3xl bg-white p-4 text-center text-sm font-medium text-black shadow cursor-pointer">Verify</SignUp.Action>
                    </div>
                    </SignUp.Strategy>
                </SignUp.Step>
            </SignUp.Root>
        </div>
    )
}