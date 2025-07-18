"use client";

import { useEffect, useRef } from 'react';
import { Message } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from './message-bubble';
import { Bot } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      setTimeout(() => {
        viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: 'smooth',
        });
      }, 100);
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1" viewportRef={viewportRef}>
      <div className="space-y-4 p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
            <Bot className="w-16 h-16 mb-4 text-primary/50"/>
            <p className="text-lg font-medium">Welcome to LinguaLink!</p>
            <p className="max-w-xs">Select your languages above and send a message to start translating.</p>
        </div>
      )}
    </ScrollArea>
  );
}
