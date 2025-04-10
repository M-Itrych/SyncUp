"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal";
import { Channel } from "@prisma/client";

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const openModal = isOpen && type === "editChannel";
    const channel = data?.channel as Channel | undefined;

    const formSchema = z.object({
        channelName: z.string().min(1, {
            message: "Channel name must be at least 1 characters long.",
        }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            channelName: "",
        }
    });

    useEffect(() => {
        if (channel) {
            form.setValue("channelName", channel.name);
        }
    }, [channel, form]);

    const isLoading = form.formState.isSubmitting;
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (!channel) return;
            
            await axios.patch(`/api/channels/${channel.id}`, {
                name: values.channelName,
            });
    
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    if (!isMounted) {
        return null;
    }

    const closeModal = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={openModal} onOpenChange={closeModal}>
            <DialogContent className="border-0 px-8">
                <DialogHeader className="flex flex-col gap-4">
                    <DialogTitle className="text-6xl font-semibold dark:text-zinc-300 text-zinc-800 text-left">Edit <br /> channel</DialogTitle>
                    <DialogDescription className="text-lg dark:text-zinc-300 text-zinc-800 text-left w-sm">Change your channel name</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                        <div className="space-y-8">
                            <FormField control={form.control} name="channelName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md font-semibold dark:text-zinc-300 text-zinc-800">
                                        Channel name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="w-full rounded-3xl border dark:border-zinc-500/50 border-zinc-800 gap-1 font-semibold text-start p-6 cursor-pointer"
                                            placeholder="Enter channel name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter>
                            <Button type="submit" variant="log" disabled={isLoading}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};