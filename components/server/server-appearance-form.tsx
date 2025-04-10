"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, "Server name is required").max(32, "Server name must be less than 32 characters"),
  serverImage: z.string().min(1, "Server image is required")
});

type FormValues = z.infer<typeof formSchema>;

interface ServerAppearanceFormProps {
  server: Server;
}

export const ServerAppearanceForm = ({ server }: ServerAppearanceFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: server.name,
      serverImage: server.serverImage
    }
  });

  const serverImage = watch("serverImage");

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess(false);
      
      await axios.patch(`/api/server/${server.id}`, values);
      
      setSuccess(true);
      router.refresh();
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onImageChange = (url?: string) => {
    setValue("serverImage", url || "", { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Server Appearance</CardTitle>
        <CardDescription>
          Customize how your server looks to other members. You can change the server name and image.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="serverImage" 
                className="text-sm font-medium block"
              >
                Server Image
              </Label>
              <div className="flex items-center gap-x-4">
                <ImageUpload 
                  endpoint="serverImage"
                  value={serverImage}
                  onChange={onImageChange}
                />
                {errors.serverImage && (
                  <p className="text-sm text-rose-500">
                    {errors.serverImage.message}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This image represents your server in the server list and at the top of your server page.
              </p>
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="name" 
                className="text-sm font-medium block"
              >
                Server Name
              </Label>
              <Input
                id="name"
                className="w-full bg-background"
                disabled={isLoading}
                placeholder="Enter server name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-rose-500">
                  {errors.name.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Choose a name that will help members recognize your server.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-rose-500/15">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-emerald-500/15">
              <Check className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-emerald-500">
                Server updated successfully!
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};