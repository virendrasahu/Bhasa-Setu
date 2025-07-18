"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});

interface MessageFormProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export function MessageForm({ onSendMessage, isSending }: MessageFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSendMessage(values.message);
    form.reset();
    inputRef.current?.focus();
  }

  return (
    <div className="p-4 border-t bg-card">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    ref={inputRef}
                    placeholder="Type your message..." 
                    autoComplete="off"
                    {...field} 
                    disabled={isSending}
                    className="py-6"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" disabled={isSending} className="h-12 w-12">
            <SendHorizonal className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
