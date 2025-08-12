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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { availabilityOptions, bubbleCategories } from "./bubbleCategories";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z
    .string({ error: "Your Bubble Needs a Name!" })
    .min(3, { error: "Bubble name must be at least 2 characters long" }),
  description: z
    .string({ error: "Briefly Describe Your Bubble" })
    .min(10, "Description must be at least 10 characters long"),
  category: z
    .enum([
      "community",
      "work",
      "education",
      "hobbies",
      "sports",
      "events",
      "family",
      "local",
      "creative",
      "tech",
      "support",
    ])
    .refine((val) => !!val, {
      message: "Please select a category",
    }),
  icon: z
    .instanceof(File, { error: "You Must Include an Icon for Your Bubble" })
    .refine((file) => file.type.startsWith("image/"), "Must be an Image File!"),
  availability: z.enum(["public", "private"]),
});

export function CreateBubbleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "community",
      availability: "public",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bubble Icon</FormLabel>
              <div className="w-full flex flex-col items-center">
                <Avatar
                  src={
                    field.value ? URL.createObjectURL(field.value) : undefined
                  }
                  onChange={(file: File) => field.onChange(file)}
                  changeLabel="Change Icon"
                  emptyLabel="Set Icon"
                  accept="image/*"
                  variant="circle"
                />
                <FormDescription className="py-2">
                  Make Sure Your Icon is a Square Image
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Chill Zone" {...field} />
              </FormControl>
              <FormDescription>This is the name of your Bubble</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="To Chill or not to Chill..." {...field} />
              </FormControl>
              <FormDescription>
                Short Description of Your Bubble
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availabilityOptions.map((options) => (
                      <SelectItem key={options.value} value={options.value}>
                        {options.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Is this Bubble Public or Private?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bubbleCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" type="submit">
                Create
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create Your Bubble</TooltipContent>
          </Tooltip>
        </div>
      </form>
    </Form>
  );
}
