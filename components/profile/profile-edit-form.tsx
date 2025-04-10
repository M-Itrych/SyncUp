"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/image-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProfileEditFormProps {
  initialData: Partial<Profile>;
  isNew: boolean;
}

const formSchema = z.object({
  userName: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).max(30, {
    message: "Username must not be longer than 30 characters.",
  }),
  bio: z.string().max(500, {
    message: "Bio must not be longer than 500 characters.",
  }).optional(),
  avatarUrl: z.string().optional(),
});

export const ProfileEditForm = ({ initialData, isNew }: ProfileEditFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: initialData.userName || "",
      bio: initialData.bio || "",
      avatarUrl: initialData.avatarUrl || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const apiUrl = isNew 
        ? "/api/profile/create" 
        : "/api/profile/update";
        
      const response = await fetch(apiUrl, {
        method: isNew ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initialData.id,
          userId: initialData.userId,
          userName: values.userName,
          bio: values.bio,
          avatarUrl: values.avatarUrl,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      toast.success(isNew ? "Profile created!" : "Profile updated!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900/80 border border-zinc-800">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center mb-6">
                    <FormLabel className="text-white mb-2">Profile Picture</FormLabel>
                    <FormControl>
                        <div className="flex justify-center">
                        <ImageUpload
                            endpoint="serverImage"
                            value={field.value || ""}
                            onChange={field.onChange}
                        />
                        </div>
                    </FormControl>
                    </FormItem>
                )}
                />
            
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-violet-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell people about yourself"
                      className="bg-zinc-800 border-zinc-700 focus-visible:ring-violet-500 min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your bio will be visible to other users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isNew ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>{isNew ? "Create Profile" : "Save Changes"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};