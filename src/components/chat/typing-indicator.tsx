export default function TypingIndicator() {
  return (
    <div className="flex animate-fade-in-up gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
        AI
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-assistant-bubble px-4 py-3">
        <span className="h-1.5 w-1.5 animate-typing-bounce rounded-full bg-current opacity-60 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-typing-bounce rounded-full bg-current opacity-60 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-typing-bounce rounded-full bg-current opacity-60 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
