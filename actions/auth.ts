"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import "dotenv/config";

export async function initAdminAccount() {
    // Check admin email specify
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return;

    // Check admin user exists
    const adminUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (adminUser) return;

    // Create admin user
    await auth.api.signUpEmail({
        body: {
            email: adminEmail,
            name: "Administrator",
            password: process.env.ADMIN_PASSWORD || "",
        }
    });
}

// Run init admin account run when this page first call
initAdminAccount();