"use client";

import { Copy, Loader2 } from "lucide-react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (message.translatedText && !message.isTranslating) {
      navigator.clipboard.writeText(message.translatedText);
      toast({
        title: "Copied to clipboard!",
        description: "Translated text has been copied.",
      });
    }
  };

  const isUser = message.sender === 'user';

  return (
    <div className={cn("flex w-full items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      <Card className={cn(
        "max-w-xs md:max-w-md lg:max-w-lg w-fit rounded-2xl shadow-md",
        isUser ? "bg-primary text-primary-foreground rounded-br-lg" : "bg-card rounded-bl-lg"
      )}>
        <CardContent className="p-3 relative">
          <p className={cn("text-sm opacity-80 pb-1 break-words", isUser ? "text-primary-foreground" : "text-muted-foreground")}>{message.originalText}</p>
          <Separator className={cn("my-2", isUser ? "bg-primary-foreground/20" : "bg-border")} />
          {message.isTranslating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">Translating...</p>
            </div>
          ) : (
            <p className="text-base break-words">{message.translatedText || " "}</p>
          )}
          {!message.isTranslating && message.translatedText && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute top-1 right-1 h-7 w-7",
                isUser ? "text-primary-foreground/70 hover:bg-white/20 hover:text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={handleCopy}
              aria-label="Copy translated text"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
