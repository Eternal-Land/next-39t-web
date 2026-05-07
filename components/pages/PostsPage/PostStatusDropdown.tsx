"use client";

import * as React from "react";

import { MoreHorizontal, FileText, Globe, Archive } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updatePostStatus } from "@/actions/posts";
import { PostStatus } from "@/generated/prisma/enums";

interface PostStatusDropdownProps {
  postId: number;
  currentStatus: PostStatus;
}

const statusOptions = [
  { value: PostStatus.draft, label: "Draft", icon: FileText },
  { value: PostStatus.published, label: "Published", icon: Globe },
  { value: PostStatus.archived, label: "Archived", icon: Archive },
] as const;

export default function PostStatusDropdown({
  postId,
  currentStatus,
}: PostStatusDropdownProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStatusChange = async (status: PostStatus) => {
    if (status === currentStatus) return;

    setIsLoading(true);
    try {
      await updatePostStatus(postId, status);
      router.refresh();
    } catch (error) {
      console.error("Failed to update post status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentStatus === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              disabled={isActive}
              className={isActive ? "bg-accent" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              {option.label}
              {isActive && (
                <span className="ml-auto text-xs text-muted-foreground">
                  (current)
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
