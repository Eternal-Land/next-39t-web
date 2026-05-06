"use server"

import { prisma } from "@/lib/prisma";
import { PostFormData } from "./types";

export async function createPost(input: PostFormData) {
    const newPost = await prisma.post.create({
        data: {
            title: input.title,
            slug: input.slug,
            content: input.content,
            shortContent: input.shortContent,
        }
    });
    return newPost.id;
}

export async function getPostById(id: number) {
    const post = await prisma.post.findUnique({
        where: { id },
    });
    return post;
}