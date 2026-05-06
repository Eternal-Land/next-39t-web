"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ContactFormData,
  contactSchema,
  upsertContactSection,
} from "@/actions/landing";

type ContactSectionFormProps = {
  initialData: ContactFormData | null;
};

export default function ContactSectionForm({
  initialData,
}: ContactSectionFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      title: initialData?.title || "Let's Work Together",
      subtitle:
        initialData?.subtitle ||
        "Have a project in mind? We'd love to hear about it.",
      email: initialData?.email || "",
      github: initialData?.github || "",
      facebook: initialData?.facebook || "",
      youtube: initialData?.youtube || "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      await upsertContactSection({
        title: data.title,
        subtitle: data.subtitle,
        email: data.email,
        github: data.github || undefined,
        facebook: data.facebook || undefined,
        youtube: data.youtube || undefined,
      });
      setSuccessMessage("Contact section saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save contact section:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Section</CardTitle>
        <CardDescription>
          Edit the contact section that appears at the bottom of the landing
          page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Let's Work Together"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              placeholder="Have a project in mind? We'd love to hear about it."
              {...register("subtitle")}
            />
            {errors.subtitle && (
              <p className="text-sm text-destructive">
                {errors.subtitle.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@39t.dev"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL (optional)</Label>
              <Input
                id="github"
                placeholder="https://github.com/39t"
                {...register("github")}
              />
              {errors.github && (
                <p className="text-sm text-destructive">
                  {errors.github.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL (optional)</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/39t"
                {...register("facebook")}
              />
              {errors.facebook && (
                <p className="text-sm text-destructive">
                  {errors.facebook.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL (optional)</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/@39t"
                {...register("youtube")}
              />
              {errors.youtube && (
                <p className="text-sm text-destructive">
                  {errors.youtube.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Changes
            </Button>
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
