import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LandingProjects from "./LandingProjects";
import LandingPosts from "./LandingPosts";
import LandingTeam from "./LandingTeam";
import LandingContact from "./LandingContact";
import LandingFooter from "./LandingFooter";

export default function HomePageClient() {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingProjects />
        <LandingPosts />
        <LandingTeam />
        <LandingContact />
      </main>
      <LandingFooter />
    </div>
  );
}
