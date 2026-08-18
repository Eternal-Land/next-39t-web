import {
  getHeroSection,
  getAllProjects,
  getAllTeamMembers,
  getContactSection,
  getLandingPageInfo,
} from "@/actions/landing";
import AdminLandingPageClient from "@/components/pages/AdminLandingPage/AdminLandingPageClient";

export default async function AdminLandingPage() {
  const [heroSection, projects, teamMembers, contactSection, landingPageInfo] =
    await Promise.all([
      getHeroSection(),
      getAllProjects(),
      getAllTeamMembers(),
      getContactSection(),
      getLandingPageInfo(),
    ]);

  return (
    <AdminLandingPageClient
      heroSection={heroSection}
      projects={projects}
      teamMembers={teamMembers}
      contactSection={contactSection}
      landingPageInfo={landingPageInfo}
    />
  );
}
