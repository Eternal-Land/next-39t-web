import { Code, Globe, Rocket, Sparkles, type LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects, getLandingPageInfo } from "@/actions/landing";

const iconMap: Record<string, LucideIcon> = {
  rocket: Rocket,
  sparkles: Sparkles,
  globe: Globe,
  code: Code,
};

// Default data for when database is empty
const defaultProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "A modern e-commerce solution with real-time inventory and seamless checkout experience.",
    tags: ["Next.js", "Prisma", "Stripe"],
    icon: "rocket",
    order: 0,
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "Collaborative task management with real-time updates and team analytics.",
    tags: ["React", "Node.js", "Socket.io"],
    icon: "sparkles",
    order: 1,
  },
  {
    id: "3",
    title: "API Gateway Service",
    description:
      "Scalable API gateway with rate limiting, caching, and comprehensive monitoring.",
    tags: ["Go", "Redis", "Docker"],
    icon: "globe",
    order: 2,
  },
];

export default async function LandingProjects() {
  const [dbProjects, landingPageInfo] = await Promise.all([
    getProjects(),
    getLandingPageInfo(),
  ]);
  const projects = dbProjects.length > 0 ? dbProjects : defaultProjects;

  const sectionTitle = landingPageInfo.projects_title ?? "Featured Projects";
  const sectionSubtitle =
    landingPageInfo.projects_subtitle ??
    "Some of our recent work that we're proud of";

  return (
    <section id="projects" className="border-t bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-4 text-muted-foreground">{sectionSubtitle}</p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-center gap-6">
          {projects.map((project) => {
            const IconComponent = iconMap[project.icon.toLowerCase()] || Rocket;
            return (
              <Card
                key={project.id}
                className="group w-full max-w-[320px] transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="size-5" />
                  </div>
                  <CardTitle className="group-hover:text-primary">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
