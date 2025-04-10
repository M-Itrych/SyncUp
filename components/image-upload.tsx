"use client"

import {UploadDropzone, UploadButton} from "@/lib/uploadthing";
import Image from "next/image";
import { X } from "lucide-react";
import {twMerge} from "tailwind-merge";

interface ImageUploadProps {
    onChange:(url?:string) => void;
    value:string;
    endpoint:"messageFile"| "serverImage"
}

export const ImageUpload = ({
    onChange,
    value,
    endpoint
}: ImageUploadProps) => {
    const filetype= value?.split(".").pop();

    if(value && filetype !== "pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                fill
                src={value}
                alt="Upload Image"
                className="rounded-full"
                />
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onChange(""); 
                    }}
                    className="bg-rose-500 text-white p-1 rounded-full
                    absolute top-0 right-0 shadow-sm"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <>
            <UploadButton
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    onChange(res[0].url);
                }}
                onUploadError={(error) => {
                    console.error(error);
                }}
                config={{
                    mode: "auto",
                    cn: twMerge
                }}
                appearance={{
                    button:
                        "!bg-violet-500 rounded[24px] font-medium cursor-pointer p-4 after:!bg-black/50",
                    allowedContent: {
                      display: "none",
                    },
                }}
            />
        </>
    );
};