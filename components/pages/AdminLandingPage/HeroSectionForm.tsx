"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import { HeroFormData, heroSchema, upsertHeroSection } from "@/actions/landing";

type HeroSectionFormProps = {
  initialData: HeroFormData | null;
};

export default function HeroSectionForm({ initialData }: HeroSectionFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      primaryButtonText: initialData?.primaryButtonText || "View Our Work",
      primaryButtonLink: initialData?.primaryButtonLink || "#projects",
      secondaryButtonText: initialData?.secondaryButtonText || "Get in Touch",
      secondaryButtonLink: initialData?.secondaryButtonLink || "#contact",
    },
  });

  const onSubmit = async (data: HeroFormData) => {
    setIsLoading(true);

    try {
      await upsertHeroSection(data);
      toast.success("Hero section saved successfully!");
    } catch (error) {
      console.error("Failed to save hero section:", error);
      toast.error("Failed to save hero section");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>
          Edit the main hero section that appears at the top of the landing
          page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Textarea
              id="title"
              placeholder="We build modern web experiences"
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
              placeholder="A small team of passionate young developers..."
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
              <Label htmlFor="primaryButtonText">Primary Button Text</Label>
              <Input
                id="primaryButtonText"
                placeholder="View Our Work"
                {...register("primaryButtonText")}
              />
              {errors.primaryButtonText && (
                <p className="text-sm text-destructive">
                  {errors.primaryButtonText.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryButtonLink">Primary Button Link</Label>
              <Input
                id="primaryButtonLink"
                placeholder="#projects"
                {...register("primaryButtonLink")}
              />
              {errors.primaryButtonLink && (
                <p className="text-sm text-destructive">
                  {errors.primaryButtonLink.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="secondaryButtonText">Secondary Button Text</Label>
              <Input
                id="secondaryButtonText"
                placeholder="Get in Touch"
                {...register("secondaryButtonText")}
              />
              {errors.secondaryButtonText && (
                <p className="text-sm text-destructive">
                  {errors.secondaryButtonText.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryButtonLink">Secondary Button Link</Label>
              <Input
                id="secondaryButtonLink"
                placeholder="#contact"
                {...register("secondaryButtonLink")}
              />
              {errors.secondaryButtonLink && (
                <p className="text-sm text-destructive">
                  {errors.secondaryButtonLink.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
