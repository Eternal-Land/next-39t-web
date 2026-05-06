import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostsPage() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button asChild>
          <Link href="/admin/posts/write">Create</Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
      </div>
    </div>
  );
}
