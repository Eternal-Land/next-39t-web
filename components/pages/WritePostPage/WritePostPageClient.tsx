"use client";

import { createPost, PostFormData, postSchema } from "@/actions/posts";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Post } from "@/generated/prisma/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export interface WritePostPageClientProps {
  post?: Post;
}

export default function WritePostPageClient({
  post,
}: WritePostPageClientProps) {
  const form = useForm<PostFormData>({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      shortContent: post?.shortContent || "",
      slug: post?.slug || "",
    },
    resolver: zodResolver(postSchema),
  });
  const [localContent, setLocalContent] = useState(post?.content || "");

  //   useEffect(() => {
  //     const savedContent = window.localStorage.getItem("localPostContent");
  //     if (savedContent) {
  //       setLocalContent(savedContent);
  //     }
  //   }, []);

  const handleLoadTemplate = async () => {
    const response = await fetch("/markdown-template.md");
    const template = await response.text();
    setLocalContent(localContent + "\n\n\n\n" + template);
  };

  const handleFormSubmit = async (values: PostFormData) => {
    try {
      values.content = localContent;
      const postId = await createPost(values);
      //   window.localStorage.removeItem("localPostContent");
      window.location.href = `/admin/posts/write/${postId}`;
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <FieldGroup className="gap-2">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="titleInput">Title</FieldLabel>
              <Input
                {...field}
                id="titleInput"
                aria-invalid={fieldState.invalid}
                placeholder="Post title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="slugInput">Slug</FieldLabel>
              <Input
                {...field}
                id="slugInput"
                aria-invalid={fieldState.invalid}
                placeholder="Post slug"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="shortContent"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor="shortContentInput">Short Content</FieldLabel>
              <Input
                {...field}
                id="shortContentInput"
                aria-invalid={fieldState.invalid}
                placeholder="Short content"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-2 justify-end">
        <Button variant="secondary" size="sm" onClick={handleLoadTemplate}>
          Load template
        </Button>
        <Button variant="secondary" size="sm">
          Preview
        </Button>
        <Button size="sm" onClick={form.handleSubmit(handleFormSubmit)}>
          Save
        </Button>
      </div>
      <hr />
      <div className="flex-1">
        <Editor
          defaultLanguage="markdown"
          options={{ scrollBeyondLastLine: false, wordWrap: "on" }}
          value={localContent}
          onChange={(value) => {
            setLocalContent(value || "");
            // window.localStorage.setItem("localPostContent", value || "");
          }}
        />
      </div>
    </div>
  );
}
