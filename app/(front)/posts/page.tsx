import Link from "next/link";
import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPublishedPosts } from "@/actions/posts";

function estimateReadTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function PostsPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            All Posts
          </h1>
          <p className="mt-4 text-muted-foreground">
            Thoughts, tutorials, and insights from our team
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mx-auto max-w-4xl text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">No posts yet</h2>
            <p className="mt-2 text-muted-foreground">
              Check back later for new content.
            </p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-4xl gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 size-3" />
                      {dayjs(post.createdAt).format("MMM D, YYYY")}
                    </span>
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 size-3" />
                      {estimateReadTime(post.content)}
                    </span>
                  </div>
                  <CardTitle className="group-hover:text-primary">
                    <Link href={`/posts/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {post.shortContent}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/posts/${post.slug}`}>
                      Read more
                      <ArrowRight className="ml-1 size-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
