import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MessageRole } from "@/lib/types/chat";

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  h1: ({ children }) => <h3 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-2 mt-3 text-base font-semibold first:mt-0">{children}</h3>,
  h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-semibold first:mt-0">{children}</h3>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/10">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-black/10 p-3 text-[0.85em] last:mb-0 dark:bg-white/10">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-current/30 pl-3 italic last:mb-0">
      {children}
    </blockquote>
  ),
};

export default function MessageBubble({
  role,
  content,
}: {
  role: MessageRole;
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div className={`flex animate-fade-in-up gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "rounded-br-sm bg-user-bubble text-user-bubble-foreground"
            : "rounded-bl-sm bg-assistant-bubble text-assistant-bubble-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
