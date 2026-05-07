"use client";

import * as React from "react";

import hljs from "highlight.js";

import { cn } from "@/lib/utils";

export interface MyCodeBlockProps extends React.ComponentProps<"pre"> {
  topText?: string;
  bottomText?: string;
  children?: string;
}

export default function MyCodeBlock({
  topText,
  bottomText,
  children,
  className,
  ...props
}: MyCodeBlockProps) {
  const codeRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (codeRef.current && children) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children]);

  return (
    <div className="flex flex-col gap-0">
      {topText && (
        <span className="text-xs text-muted-foreground">{topText}</span>
      )}
      <pre
        className={cn(
          "overflow-x-auto rounded-md bg-muted p-4 text-sm",
          className,
        )}
        {...props}
      >
        <code ref={codeRef}>{children}</code>
      </pre>
      {bottomText && (
        <span className="text-xs text-muted-foreground">{bottomText}</span>
      )}
    </div>
  );
}
