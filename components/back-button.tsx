"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="ghost"
      className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition"
      size="sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  );
};