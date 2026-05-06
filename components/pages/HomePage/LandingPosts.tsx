import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const posts = [
  {
    title: "Building Scalable APIs with Next.js App Router",
    excerpt:
      "Learn how to structure your Next.js API routes for maximum scalability and maintainability using the new App Router.",
    date: "2024-12-15",
    readTime: "5 min read",
    category: "Tutorial",
    slug: "building-scalable-apis-nextjs",
  },
  {
    title: "Why We Switched from REST to tRPC",
    excerpt:
      "Our journey migrating from traditional REST APIs to tRPC and the benefits we discovered along the way.",
    date: "2024-12-10",
    readTime: "8 min read",
    category: "Experience",
    slug: "switching-rest-to-trpc",
  },
  {
    title: "Tailwind CSS v4: What's New and Exciting",
    excerpt:
      "A deep dive into the new features of Tailwind CSS v4 and how it improves our development workflow.",
    date: "2024-12-05",
    readTime: "6 min read",
    category: "News",
    slug: "tailwind-css-v4-whats-new",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LandingPosts() {
  return (
    <section id="posts" className="border-t py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Latest Posts
          </h2>
          <p className="mt-4 text-muted-foreground">
            Thoughts, tutorials, and insights from our team
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 size-3" />
                    {formatDate(post.date)}
                  </span>
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 size-3" />
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="group-hover:text-primary">
                  <a href={`/posts/${post.slug}`} className="hover:underline">
                    {post.title}
                  </a>
                </CardTitle>
                <CardDescription className="text-base">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/posts/${post.slug}`}>
                    Read more
                    <ArrowRight className="ml-1 size-3" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <a href="/posts">
              View All Posts
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
