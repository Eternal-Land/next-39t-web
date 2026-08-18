"use server";

import { revalidatePath } from "next/cache";

import { LandingPageInfoKey } from "@/generated/prisma/browser";
import { prisma } from "@/lib/prisma";
import {
    ContactFormData,
    HeroFormData,
    LandingPageInfoMap,
    ProjectInput,
    TeamMemberInput,
} from "./types";

// ============================================================================
// Landing Page Info (for all section data as key-value pairs)
// ============================================================================

export async function getLandingPageInfo(): Promise<LandingPageInfoMap> {
    const items = await prisma.landingPageInfo.findMany();
    return Object.fromEntries(items.map(item => [item.key, item.value])) as LandingPageInfoMap;
}

export async function upsertLandingPageInfo(key: LandingPageInfoKey, value: string) {
    const result = await prisma.landingPageInfo.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });

    revalidatePath("/");
    revalidatePath("/admin/landing");

    return result;
}

export async function upsertLandingPageInfoBatch(data: LandingPageInfoMap) {
    const entries = Object.entries(data) as [LandingPageInfoKey, string][];

    await Promise.all(
        entries.map(([key, value]) =>
            prisma.landingPageInfo.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            })
        )
    );

    revalidatePath("/");
    revalidatePath("/admin/landing");
}

// ============================================================================
// Hero Section (stored in LandingPageInfo as key-value pairs)
// ============================================================================

export async function getHeroSection(): Promise<HeroFormData | null> {
    const info = await getLandingPageInfo();

    // Check if we have hero data
    if (!info.hero_title) {
        return null;
    }

    return {
        title: info.hero_title || "",
        subtitle: info.hero_subtitle || "",
        primaryButtonText: info.hero_primary_button_text || "View Our Work",
        primaryButtonLink: info.hero_primary_button_link || "#projects",
        secondaryButtonText: info.hero_secondary_button_text || "Get in Touch",
        secondaryButtonLink: info.hero_secondary_button_link || "#contact",
    };
}

export async function upsertHeroSection(data: HeroFormData) {
    await upsertLandingPageInfoBatch({
        hero_title: data.title,
        hero_subtitle: data.subtitle,
        hero_primary_button_text: data.primaryButtonText,
        hero_primary_button_link: data.primaryButtonLink,
        hero_secondary_button_text: data.secondaryButtonText,
        hero_secondary_button_link: data.secondaryButtonLink,
    });

    return data;
}

// ============================================================================
// Contact Section (stored in LandingPageInfo as key-value pairs)
// ============================================================================

export async function getContactSection(): Promise<ContactFormData | null> {
    const info = await getLandingPageInfo();

    // Check if we have contact data
    if (!info.contact_title && !info.contact_email) {
        return null;
    }

    return {
        title: info.contact_title || "Let's Work Together",
        subtitle: info.contact_subtitle || "Have a project in mind? We'd love to hear about it.",
        email: info.contact_email || "",
        github: info.contact_github || undefined,
        facebook: info.contact_facebook || undefined,
        youtube: info.contact_youtube || undefined,
    };
}

export async function upsertContactSection(data: ContactFormData) {
    const updateData: LandingPageInfoMap = {
        contact_title: data.title,
        contact_subtitle: data.subtitle,
        contact_email: data.email,
    };

    if (data.github) {
        updateData.contact_github = data.github;
    }

    if (data.facebook) {
        updateData.contact_facebook = data.facebook;
    }

    if (data.youtube) {
        updateData.contact_youtube = data.youtube;
    }

    await upsertLandingPageInfoBatch(updateData);

    return data;
}

// ============================================================================
// Projects
// ============================================================================

export async function getProjects() {
    return prisma.project.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });
}

export async function getAllProjects() {
    return prisma.project.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createProject(data: ProjectInput) {
    const project = await prisma.project.create({
        data: {
            ...data,
            order: data.order ?? 0,
            isActive: data.isActive ?? true,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin/landing");

    return project;
}

export async function updateProject(id: number, data: ProjectInput) {
    const project = await prisma.project.update({
        where: { id },
        data,
    });

    revalidatePath("/");
    revalidatePath("/admin/landing");

    return project;
}

export async function deleteProject(id: number) {
    await prisma.project.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/landing");
}

// ============================================================================
// Team Members
// ============================================================================

export async function getTeamMembers() {
    return prisma.teamMember.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
    });
}

export async function getAllTeamMembers() {
    return prisma.teamMember.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createTeamMember(data: TeamMemberInput) {
    const member = await prisma.teamMember.create({
        data: {
            ...data,
            order: data.order ?? 0,
            isActive: data.isActive ?? true,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin/landing");

    return member;
}

export async function updateTeamMember(id: number, data: TeamMemberInput) {
    const member = await prisma.teamMember.update({
        where: { id },
        data,
    });

    revalidatePath("/");
    revalidatePath("/admin/landing");

    return member;
}

export async function deleteTeamMember(id: number) {
    await prisma.teamMember.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/admin/landing");
}
