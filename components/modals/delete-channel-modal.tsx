"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { Channel } from "@prisma/client";

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const openModal = isOpen && type === "deleteChannel";
    const channel = data?.channel as Channel | undefined;
    
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const onDelete = async () => {
        if (!channel) return;
        
        try {
            setIsLoading(true);
            
            await axios.delete(`/api/channels/${channel.id}`);
            
            onClose();
            
            router.refresh();

            setTimeout(() => {
                router.push(`/a/servers/${channel.serverId}`);
            }, 300);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    if (!isMounted) {
        return null;
    }
    
    return (
        <Dialog open={openModal} onOpenChange={onClose}>
            <DialogContent className="border-0 px-8">
                <DialogHeader className="flex flex-col gap-4">
                    <DialogTitle className="text-6xl font-semibold dark:text-zinc-300 text-zinc-800 text-left">Delete <br /> channel</DialogTitle>
                    <DialogDescription className="text-lg dark:text-zinc-300 text-zinc-800 text-left">
                        Are you sure you want to delete <span className="font-semibold text-red-500">#{channel?.name}</span>?
                        <br />
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-8">
                    <div className="flex items-center w-full gap-4">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="rounded-3xl p-6 flex-1"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onDelete}
                            variant="destructive"
                            className="rounded-3xl p-6 flex-1"
                            disabled={isLoading}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};