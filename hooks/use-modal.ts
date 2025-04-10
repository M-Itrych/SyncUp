import { create } from "zustand";
import { Channel, Server } from "@prisma/client";

export type ModalType = 
  | "createServer" 
  | "editServer" 
  | "editProfile"  
  | "invite" 
  | "createChannel" 
  | "editChannel" 
  | "deleteChannel" 
  | "leaveServer" 
  | "deleteServer";

interface ModalData {
  server?: Server,
  username?: string,
  avatarUrl?: string,
  channel?: Channel,
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));