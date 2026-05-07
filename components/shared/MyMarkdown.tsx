"use client";

import Markdown from "react-markdown";

import MyCodeBlock from "./MyCodeBlock";

export interface MyMarkdownProps {
  content?: string;
}

function generateId(children: React.ReactNode) {
  return children?.toString().toLowerCase().replace(/\s+/g, "-");
}

export default function MyMarkdown({ content }: MyMarkdownProps) {
  return (
    <Markdown
      components={{
        h1: ({ children, ...props }) => (
          <h1
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
            id={generateId(children)}
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10"
            id={generateId(children)}
            {...props}
          >
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3
            className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8"
            id={generateId(children)}
            {...props}
          >
            {children}
          </h3>
        ),
        h4: ({ children, ...props }) => (
          <h4
            className="scroll-m-20 text-xl font-semibold tracking-tight mt-6"
            id={generateId(children)}
            {...props}
          >
            {children}
          </h4>
        ),
        h5: ({ children, ...props }) => (
          <h5
            className="scroll-m-20 text-lg font-semibold tracking-tight mt-4"
            id={generateId(children)}
            {...props}
          >
            {children}
          </h5>
        ),
        p: (props) => (
          <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
        ),
        span: (props) => <span {...props} />,
        a: ({ href, children, ...props }) => (
          <a
            className="text-primary underline underline-offset-4 hover:text-primary/80"
            href={href}
            {...props}
          >
            {children}
          </a>
        ),
        ul: (props) => (
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
        ),
        ol: (props) => (
          <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
        ),
        li: (props) => <li {...props} />,
        code: ({ children, ...props }) => (
          <code
            className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
            {...props}
          >
            {children}
          </code>
        ),
        pre: ({ children }) => {
          const codeElement = children as React.ReactElement<{
            children?: string;
          }>;
          const codeContent = codeElement?.props?.children;
          return <MyCodeBlock className="my-6">{codeContent}</MyCodeBlock>;
        },
      }}
    >
      {content}
    </Markdown>
  );
}
