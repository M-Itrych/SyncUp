"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Check, CopyIcon, RefreshCw } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useOrigin } from "@/hooks/use-origin";

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const openModal = isOpen && type === "invite";
    const { server } = data;
    const origin = useOrigin();
    const inviteLink = `${origin}/invite/${server?.serverInvite}`;
    const [copy, setCopy] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            setCopy(true);
            setTimeout(() => {
                setCopy(false);
            }, 2000);
        });
    };

    const handleNewLink = async () => {
        try {
            setIsLoading(true);
            const res = await axios.patch(`/api/server/${server?.id}/server-invite`);
            onOpen("invite", { server: res.data });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={openModal} onOpenChange={onClose}>
            <DialogContent className="border-0">
                <DialogHeader className="flex flex-col">
                    <DialogTitle className="text-4xl font-semibold dark:text-zinc-300 text-zinc-800 text-left">
                        Invite members
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col px-1 gap-4 mt-4">
                    <Label className="text-zinc-500 text-sm font-medium dark:text-zinc-400 text-left">
                        Invite link:
                    </Label>
                    <div className="flex gap-x-2 mt-2 mb-2 items-center">
                        <Input disabled={isLoading} value={inviteLink} />
                        <Button disabled={isLoading} onClick={handleCopy}>
                            {copy ? <Check className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
                <div className="flex">
                    <Button
                        disabled={isLoading}
                        onClick={handleNewLink}
                        variant="link"
                        className="text-zinc-500 text-xs font-medium dark:text-zinc-400 text-left"
                    >
                        New link
                        <RefreshCw className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};