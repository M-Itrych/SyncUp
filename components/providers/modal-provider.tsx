"use client"

import {ServerModal} from "@/components/modals/create-server-modal";
import {useEffect, useState} from "react";
import {EditProfileModal} from "@/components/modals/profile-edit-modal";
import { InviteModal } from "../modals/invite-modal";
import { ChannelModal } from "../modals/create-channel-modal";
import { LeaveServerModal } from "../modals/leave-modal";
import { DeleteServerModal } from "../modals/delete-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <ServerModal />
            <EditProfileModal />
            <InviteModal />
            <ChannelModal />
            <LeaveServerModal/>
            <DeleteServerModal/>
            <EditChannelModal/>
            <DeleteChannelModal/>
        </>
    );
};
