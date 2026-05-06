import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTeamMembers, getLandingPageInfo } from "@/actions/landing";
import GitHubIcon from "@/components/icons/GithubIcon";

// Default data for when database is empty
const defaultTeamMembers = [
  {
    id: "1",
    name: "Alex Chen",
    role: "Full Stack Developer",
    avatar: null,
    initials: "AC",
    github: "https://github.com",
    order: 0,
  },
  {
    id: "2",
    name: "Jordan Lee",
    role: "Frontend Developer",
    avatar: null,
    initials: "JL",
    github: "https://github.com",
    order: 1,
  },
  {
    id: "3",
    name: "Sam Taylor",
    role: "Backend Developer",
    avatar: null,
    initials: "ST",
    github: "https://github.com",
    order: 2,
  },
];

export default async function LandingTeam() {
  const [dbMembers, landingPageInfo] = await Promise.all([
    getTeamMembers(),
    getLandingPageInfo(),
  ]);
  const teamMembers = dbMembers.length > 0 ? dbMembers : defaultTeamMembers;

  const sectionBadge = landingPageInfo.team_badge ?? "Our Team";
  const sectionTitle = landingPageInfo.team_title ?? "Meet the Developers";
  const sectionSubtitle =
    landingPageInfo.team_subtitle ?? "Young, passionate, and always learning";

  return (
    <section id="team" className="border-t py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            <Users className="mr-1 size-3" />
            {sectionBadge}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-muted-foreground">{sectionSubtitle}</p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-center gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="w-full max-w-[280px] text-center">
              <CardHeader>
                <Avatar className="mx-auto size-20">
                  <AvatarImage src={member.avatar || ""} alt={member.name} />
                  <AvatarFallback className="text-lg">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                {member.github && (
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitHubIcon className="mr-2 size-4" />
                      GitHub
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
