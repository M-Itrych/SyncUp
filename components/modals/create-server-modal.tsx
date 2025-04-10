"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
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
import {useModal} from "@/hooks/use-modal";
import {ImageUpload} from "@/components/image-upload";




export const ServerModal = () => {
    const { isOpen , onClose, type } = useModal();
    const openModal = isOpen && type === "createServer";

    const formSchema = z.object({
        serverName: z.string().min(4, {
            message: "Server name must be at least 4 characters.",
        }),
        serverImage : z.string().optional()
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serverName: "",
            serverImage: "",
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
            await axios.post("/api/server", values)

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
                    <DialogTitle className="text-6xl font-semibold dark:text-zinc-300 text-zinc-800 text-left">Create <br /> your Server</DialogTitle>
                    <DialogDescription className="text-lg dark:text-zinc-300 text-zinc-800  text-left w-sm">Add name to your server </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-8">
                        <div className="space-y-8">
                            <FormField control={form.control} name="serverName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-md font-semibold dark:text-zinc-300 text-zinc-800">
                                        Server name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="w-full rounded-3xl border dark:border-zinc-500/50 border-zinc-800 gap-1 font-semibold text-start p-6 cursor-pointer"
                                            placeholder="Enter server name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <div className="flex items-center justify-center text-center">
                            <FormField control={form.control}
                                       name="serverImage"
                                       render={({field}) => (
                                           <FormItem>
                                               <div className="flex flex-col items-center justify-evenly  gap-4 ">
                                                   <FormLabel className="text-lg font-semibold dark:text-zinc-300 text-zinc-800">
                                                       Choose server image:
                                                   </FormLabel>
                                               <FormControl>
                                                   <ImageUpload
                                                       endpoint="serverImage"
                                                       value={field.value || ""}
                                                       onChange={field.onChange}
                                                   />
                                               </FormControl>
                                               </div>
                                           </FormItem>
                                       )}/>
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
