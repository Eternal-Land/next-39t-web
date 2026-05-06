import z from "zod";

export const postSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
    slug: z.string().min(1, "Slug is required").max(255, "Slug must be at most 255 characters"),
    shortContent: z.string().min(1, "Short content is srequired").max(255, "Short content must be at most 255 characters"),
    content: z.string(),
});

export type PostFormData = z.infer<typeof postSchema>;