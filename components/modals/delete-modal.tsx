"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { Button } from "../ui/button";
import { Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DeleteServerModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const openModal = isOpen && type === "deleteServer";
    const { server } = data;

    const [isLoading, setIsLoading] = useState(false);

    return (
        <Dialog open={openModal} onOpenChange={onClose}>
            <DialogContent className="border-0">
                <DialogHeader className="flex flex-col">
                    <DialogTitle className="text-4xl font-semibold dark:text-zinc-300 text-zinc-800 text-left">
                        Delete Server
                    </DialogTitle>
                </DialogHeader>
                <div>
                    Are you sure you want to <span className="font-bold text-red-500 transition-all animate-shake "> Delete </span> <span className="font-bold text-violet-500">{server?.name}</span>?
                </div>
                
                <div className="flex justify-end mt-4">
                    <Button
                        variant="outline"
                        className="mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                        onClick={async () => {
                            setIsLoading(true);
                            try {
                                await axios.delete(`/api/server/${server?.id}/delete`);
                                onClose();
                                router.refresh();
                            } catch (error) {
                                console.log(error);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                    >
                        {isLoading ? (
                            <RefreshCw className="animate-spin" />
                        ) : (
                            <Check />
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
    
};

