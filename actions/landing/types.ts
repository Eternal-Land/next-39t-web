import z from "zod";

import { LandingPageInfoKey } from "@/generated/prisma/browser";

// Re-export the Prisma enum for use in components (browser-safe)
export { LandingPageInfoKey } from "@/generated/prisma/browser";

// =============================================================================
// Landing Page Info
// =============================================================================

// Type-safe map using Prisma enum keys
export type LandingPageInfoMap = Partial<Record<LandingPageInfoKey, string>>;

// =============================================================================
// Contact Section
// =============================================================================

export const contactSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    email: z.email("Invalid email address"),
    github: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// =============================================================================
// Hero Section
// =============================================================================

export const heroSchema = z.object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().min(1, "Subtitle is required"),
    primaryButtonText: z.string().min(1, "Primary button text is required"),
    primaryButtonLink: z.string().min(1, "Primary button link is required"),
    secondaryButtonText: z.string().min(1, "Secondary button text is required"),
    secondaryButtonLink: z.string().min(1, "Secondary button link is required"),
});

export type HeroFormData = z.infer<typeof heroSchema>;

// =============================================================================
// Project
// =============================================================================

export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    tags: z.array(z.string()),
    iconUrl: z.string().min(1, "Icon is required"),
    order: z.number().min(0),
    isActive: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// Input type for create/update operations (optional fields have defaults in actions)
export type ProjectInput = Omit<ProjectFormData, "order" | "isActive"> & {
    order?: number;
    isActive?: boolean;
};

// =============================================================================
// Team Member
// =============================================================================

export const teamMemberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    avatar: z.string().optional(),
    initials: z.string().min(1, "Initials are required").max(3, "Max 3 characters"),
    github: z.string().optional(),
    order: z.number().min(0),
    isActive: z.boolean(),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

// Input type for create/update operations (optional fields have defaults in actions)
export type TeamMemberInput = Omit<TeamMemberFormData, "order" | "isActive"> & {
    order?: number;
    isActive?: boolean;
};
