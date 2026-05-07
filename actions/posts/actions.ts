"use server"

import { prisma } from "@/lib/prisma";
import { PostFormData } from "./types";
import { PostStatus } from "@/generated/prisma/enums";

export async function getPosts() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
    });
    return posts;
}

export async function getPublishedPosts() {
    const posts = await prisma.post.findMany({
        where: { status: PostStatus.published },
        orderBy: { createdAt: "desc" },
    });
    return posts;
}

export async function getPublishedPostBySlug(slug: string) {
    const post = await prisma.post.findFirst({
        where: { slug, status: PostStatus.published },
    });
    return post;
}

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

export async function updatePost(id: number, input: PostFormData) {
    const updatedPost = await prisma.post.update({
        where: { id },
        data: {
            title: input.title,
            slug: input.slug,
            content: input.content,
            shortContent: input.shortContent,
        }
    });
    return updatedPost.id;
}

export async function updatePostStatus(id: number, status: PostStatus) {
    await prisma.post.update({
        where: { id },
        data: { status },
    });
}