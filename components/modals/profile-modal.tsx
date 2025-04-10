"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";




export const ProfileModal = () => {
    const formSchema = z.object({
        username: z.string().min(4, {
            message: "Username must be at least 4 characters.",
        }).max(14, {
            message: "Username can be maximum 14 characters.",
        }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, [])



    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/profile", values)

            form.reset();
            router.refresh();
            window.location.reload();

        } catch (error) {
            console.log(error);
        }
    }
    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open>
            <DialogContent className="border-0 px-8 [&>button]:hidden" >
                <DialogHeader className="flex flex-col gap-4">
                    <DialogTitle className="text-6xl font-semibold dark:text-zinc-300 text-zinc-800 text-left">Create <br /> your Profile</DialogTitle>
                    <DialogDescription className="text-lg dark:text-zinc-300 text-zinc-800  text-left w-sm">Add nickname to your profile </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-8">
                        <div className="space-y-8">
                            <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md font-semibold dark:text-zinc-300 text-zinc-800">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="w-full rounded-3xl border dark:border-zinc-500/50 border-zinc-800 gap-1 font-semibold text-start p-6 cursor-pointer"
                                            placeholder="Enter username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter >
                            <Button type="submit" variant="log" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
