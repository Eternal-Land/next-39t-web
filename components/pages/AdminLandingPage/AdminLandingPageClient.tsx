"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import HeroSectionForm from "./HeroSectionForm";
import ProjectsManager from "./ProjectsManager";
import TeamManager from "./TeamManager";
import ContactSectionForm from "./ContactSectionForm";
import { Project, TeamMember } from "@/generated/prisma/browser";
import {
  ContactFormData,
  HeroFormData,
  LandingPageInfoMap,
} from "@/actions/landing";

type AdminLandingPageClientProps = {
  heroSection: HeroFormData | null;
  projects: Project[];
  teamMembers: TeamMember[];
  contactSection: ContactFormData | null;
  landingPageInfo: LandingPageInfoMap;
};

export default function AdminLandingPageClient({
  heroSection,
  projects,
  teamMembers,
  contactSection,
  landingPageInfo,
}: AdminLandingPageClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Landing Page Management
        </h1>
        <p className="text-muted-foreground">
          Manage the content displayed on your public landing page.
        </p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="mt-6">
          <HeroSectionForm initialData={heroSection} />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsManager initialData={projects} sectionInfo={landingPageInfo} />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamManager initialData={teamMembers} sectionInfo={landingPageInfo} />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <ContactSectionForm initialData={contactSection} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
