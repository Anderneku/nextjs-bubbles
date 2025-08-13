"use client";
// Zod Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Form Imports
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// @ts-ignore
import { Avatar } from "@files-ui/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const formSchema = z.object({
  body: z
    .string({ error: "Your Bubble Needs a Name!" })
    .min(3, { error: "Bubble name must be at least 2 characters long" }),
  image: z
    .instanceof(File, { error: "You Must Include an Icon for Your Bubble" })
    .refine((file) => file.type.startsWith("image/"), "Must be an Image File!"),
});

export function CreatePostForm({ bubbleId, closeDialog }: { bubbleId: string, closeDialog: ()=>void }) {
  const { user } = useUser();
  const createPost = useMutation(api.posts.createPost);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    closeDialog();
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = {
        timestamp: timestamp,
        folder: "posts_images",
      };

      // Get signature from the API
      const signatureResponse = await fetch("/api/sign-cloudinary-params", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paramsToSign }),
      });
      const { signature } = await signatureResponse.json();
      const formData = new FormData();
      console.log(formData);
      formData.append("file", values.image);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "posts_images");
      formData.append("quality", "60");
      formData.append("fetch_format", "auto");
      formData.append(
        "api_key",
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string
      );

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await uploadResponse.json();

      //   Create Bubble in Convex dB
      if (user) {
        createPost({
          body: values.body,
          bubbleId: bubbleId as string,
          imageUrl: result.secure_url,
          authorId: user?.id,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <div className="w-full flex flex-col items-center">
                <Avatar
                  src={
                    field.value ? URL.createObjectURL(field.value) : undefined
                  }
                  onChange={(file: File) => field.onChange(file)}
                  changeLabel="Change Image"
                  emptyLabel="Set Image"
                  accept="image/*"
                />
                {/* <FormDescription className="py-2">
                  Make Sure Your Icon is a Square Image
                </FormDescription> */}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Input placeholder="Chill Zone" {...field} />
              </FormControl>
              <FormDescription>
                This is the content of your post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" type="submit">
                Post
              </Button>
            </TooltipTrigger>
            <TooltipContent>Post it!</TooltipContent>
          </Tooltip>
        </div>
      </form>
    </Form>
  );
}
