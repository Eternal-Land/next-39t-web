import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import MyMarkdown from "@/components/shared/MyMarkdown";
import { getPublishedPostBySlug } from "@/actions/posts";

function estimateReadTime(content: string) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}) {
  const { postSlug } = await params;
  const post = await getPublishedPostBySlug(postSlug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to posts
            </Link>
          </Button>

          <header className="mb-12">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {dayjs(post.createdAt).format("MMM D, YYYY")}
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {estimateReadTime(post.content)}
              </span>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              {post.shortContent}
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MyMarkdown content={post.content} />
          </div>
        </div>
      </div>
    </article>
  );
}
