import { getPostById } from "@/actions/posts";
import WritePostPageClient from "@/components/pages/WritePostPage/WritePostPageClient";

export default async function WritePostPage({
  params,
}: {
  params: Promise<{ postId?: string }>;
}) {
  const { postId } = await params;
  const post = await getPostById(Number(postId));
  if (!post) {
    return <p>Post not found</p>;
  }

  return <WritePostPageClient post={post} />;
}
