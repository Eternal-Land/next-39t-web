import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getContactSection } from "@/actions/landing";
import GitHubIcon from "@/components/icons/GithubIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import YouTubeIcon from "@/components/icons/YoutubeIcon";

// Default data for when database is empty
const defaultContactData = {
  title: "Let's Work Together",
  subtitle:
    "Have a project in mind? We'd love to hear about it. Drop us a message and let's create something amazing together.",
  email: "hello@39t.dev",
  github: "https://github.com/39t",
  facebook: undefined,
  youtube: undefined,
};

export default async function LandingContact() {
  const contactData = (await getContactSection()) || defaultContactData;

  return (
    <section id="contact" className="border-t bg-muted/30 py-24">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          <Mail className="mr-1 size-3" />
          Contact
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {contactData.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {contactData.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <a href={`mailto:${contactData.email}`}>
              <Mail className="mr-2 size-4" />
              {contactData.email}
            </a>
          </Button>
          {contactData.github && (
            <Button variant="outline" size="lg" asChild>
              <a
                href={contactData.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="mr-2 size-4" />
                GitHub
              </a>
            </Button>
          )}
          {contactData.facebook && (
            <Button variant="outline" size="lg" asChild>
              <a
                href={contactData.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon className="mr-2 size-4" />
                Facebook
              </a>
            </Button>
          )}
          {contactData.youtube && (
            <Button variant="outline" size="lg" asChild>
              <a
                href={contactData.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon className="mr-2 size-4" />
                YouTube
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
