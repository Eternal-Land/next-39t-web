import LandingHero from "./LandingHero";
import LandingProjects from "./LandingProjects";
import LandingPosts from "./LandingPosts";
import LandingTeam from "./LandingTeam";
import LandingContact from "./LandingContact";

export default function HomePageClient() {
  return (
    <>
      <LandingHero />
      <LandingProjects />
      <LandingPosts />
      <LandingTeam />
      <LandingContact />
    </>
  );
}
