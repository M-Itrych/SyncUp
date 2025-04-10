"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Send, Hash, MoreVertical, Trash2, Edit2, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Channel, Message as DBMessage } from "@prisma/client";
import { pusherClient } from "@/lib/pusher";

const formatMessageTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  });
};

const MessageOptionsDropdown = ({ 
  message, 
  onEdit, 
  onDelete 
}: { 
  message: Message, 
  onEdit: () => void, 
  onDelete: () => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-200 transition"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-zinc-800 rounded-md shadow-lg z-50 overflow-hidden">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-zinc-700 text-zinc-300 hover:text-white"
          >
            <Edit2 className="h-4 w-4 mr-2" /> Edit
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-red-500/20 text-red-400 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};


interface Message extends DBMessage {
  user: {
    id: string;
    name: string;
    image: string;
  };
}


interface FormValues {
  content: string;
}


interface ChannelIdPageClientProps {
  channel: Channel;
  initialMessages: Message[];
  serverId: string;
}

const ChannelIdPageClient = ({
  channel,
  initialMessages,
  serverId
}: ChannelIdPageClientProps) => {

  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  

  const scrollRef = useRef<HTMLDivElement>(null);
  

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>();
  

  const messageContent = watch("content");
  

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);
  

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  

  useEffect(() => {
    const pusherChannel = pusherClient.subscribe(`channel-${channel.id}`);
    
    const handleNewMessage = (newMessage: Message) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };
    
    const handleUpdateMessage = (updatedMessage: Message) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === updatedMessage.id 
            ? { ...msg, ...updatedMessage, isEdited: true } 
            : msg
        )
      );
    };
    
    const handleDeleteMessage = ({ messageId, content, isDeleted }: { messageId: string, content: string, isDeleted: boolean }) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId 
            ? { ...msg, content, isDeleted } 
            : msg
        )
      );
    };
    
    pusherChannel.bind('message:new', handleNewMessage);
    pusherChannel.bind('message:update', handleUpdateMessage);
    pusherChannel.bind('message:delete', handleDeleteMessage);
    

    return () => {
      pusherClient.unsubscribe(`channel-${channel.id}`);
      pusherChannel.unbind('message:new', handleNewMessage);
      pusherChannel.unbind('message:update', handleUpdateMessage);
      pusherChannel.unbind('message:delete', handleDeleteMessage);
    };
  }, [channel.id]);
  

  const onSubmit = async (data: FormValues) => {
    if (!data.content || !data.content.trim()) return;
    
    setIsLoading(true);
    
    try {
      if (editingMessageId) {

        await axios.patch(`/api/messages/${editingMessageId}`, {
          content: data.content,
          channelId: channel.id,
        });
        setEditingMessageId(null);
      } else {

        const payload = {
          content: data.content,
          serverId,
        };

        await axios.post(`/api/channels/${channel.id}/messages`, payload);
      }
      

      reset();
    } catch (error) {
      console.error("Error sending/updating message:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setValue("content", message.content);
  };
  
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`/api/messages/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-zinc-900 b">
      <div className="flex items-center h-[48px] px-4 borde border-zinc-500/30 bg-zinc-900 shadow-sm">
        <Hash className="h-5 w-5 mr-2 text-zinc-400" />
        <h2 className="text-white font-semibold text-base">{channel.name}</h2>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <p className="text-center">No messages yet. Be the first to send a message in #{channel.name}!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className="flex items-start gap-4 hover:bg-zinc-800/50 p-2 rounded-md group relative"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  src={message.user.image || '/default-avatar.png'}
                  alt={message.user.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">
                    {message.user.name}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {formatMessageTimestamp(message.createdAt.toString())}
                  </span>
                  {message.isEdited && !message.isDeleted && (
                    <span 
                      className="text-xs text-zinc-500 flex items-center"
                      title="This message was edited"
                    >
                      <Info className="h-3 w-3 mr-1" /> Edited
                    </span>
                  )}
                </div>
                <p className={`text-sm break-words ${
                  message.isDeleted 
                    ? 'text-zinc-500 italic' 
                    : 'text-zinc-200'
                }`}>
                  {message.isDeleted ? 'This message was deleted' : message.content}
                </p>
              </div>
              {!message.isDeleted && (
                <div className="absolute top-2 right-2">
                  <MessageOptionsDropdown 
                    message={message}
                    onEdit={() => handleEditMessage(message)}
                    onDelete={() => handleDeleteMessage(message.id)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-zinc-900 border-t border-zinc-500/30">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
          <div className="flex-1 bg-zinc-800 rounded-lg relative">
            <input
              {...register("content")}
              placeholder={editingMessageId 
                ? `Edit message in #${channel.name}` 
                : `Message #${channel.name}`
              }
              className="w-full bg-transparent p-3 outline-none text-white text-sm"
              disabled={isLoading}
            />
            {editingMessageId && (
              <button 
                type="button"
                onClick={() => {
                  setEditingMessageId(null);
                  reset();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
            )}
          </div>
          <button 
            type="submit"
            disabled={isLoading || !messageContent?.trim()}
            className={`p-2 rounded-full transition ${
              !messageContent?.trim() || isLoading
                ? 'bg-zinc-800 text-zinc-500' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {editingMessageId ? 'Update' : <Send className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChannelIdPageClient;