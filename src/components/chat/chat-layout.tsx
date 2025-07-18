"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/lib/types";
import { languages, transliterationTarget } from "@/lib/languages";
import { translateMessage } from "@/ai/flows/translate-message";
import { transliterateInput } from "@/ai/flows/transliterate-input";
import { useToast } from "@/hooks/use-toast";

import { MessageList } from "./message-list";
import { MessageForm } from "./message-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Hindi");
  const [useTransliteration, setUseTransliteration] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        originalText: "Welcome to LinguaLink! How can I help you translate today?",
        translatedText: "लिंगुआलिंक में आपका स्वागत है! आज मैं आपकी अनुवाद में कैसे मदद कर सकता हूँ?",
        sourceLang: 'English',
        targetLang: 'Hindi',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSwapLanguages = () => {
    if (useTransliteration) {
        toast({
            title: "Can't swap in transliteration mode",
            description: "Please turn off transliteration to swap languages.",
            variant: "destructive"
        })
        return;
    }
    const currentSource = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(currentSource);
  }

  const handleSendMessage = useCallback(async (text: string) => {
    setIsSending(true);

    const userMessageId = new Date().toISOString();
    const userMessage: Message = {
      id: userMessageId,
      sender: "user",
      originalText: text,
      translatedText: "",
      sourceLang: sourceLang,
      targetLang: useTransliteration ? transliterationTarget.value : targetLang,
      timestamp: new Date(),
      isTranslating: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      let translationResult;
      const finalTargetLang = useTransliteration ? transliterationTarget.value : targetLang;

      if (useTransliteration) {
        const { transliteratedText } = await transliterateInput({
          text,
          sourceLanguage: sourceLang,
          targetLanguage: finalTargetLang,
        });
        translationResult = transliteratedText;
      } else {
        const { translatedText } = await translateMessage({
          text,
          sourceLanguage: sourceLang,
          targetLanguage: finalTargetLang,
        });
        translationResult = translatedText;
      }
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessageId
            ? { ...msg, translatedText: translationResult, isTranslating: false }
            : msg
        )
      );

      // Simulate bot reply
      setTimeout(async () => {
        const botMessageId = new Date().toISOString() + "-bot";
        const botMessage: Message = {
            id: botMessageId,
            sender: "bot",
            originalText: translationResult,
            translatedText: "",
            sourceLang: targetLang,
            targetLang: sourceLang,
            timestamp: new Date(),
            isTranslating: true,
        };
        setMessages((prev) => [...prev, botMessage]);

        const { translatedText: botReplyTranslation } = await translateMessage({
            text: translationResult,
            sourceLanguage: targetLang,
            targetLanguage: sourceLang
        });

        setMessages((prev) =>
            prev.map((msg) =>
            msg.id === botMessageId
                ? { ...msg, translatedText: botReplyTranslation, isTranslating: false }
                : msg
            )
        );
      }, 1000);


    } catch (error) {
      console.error("Translation failed:", error);
      toast({
        title: "Error",
        description: "Failed to get translation. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessageId ? { ...msg, translatedText: "Error", isTranslating: false } : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [sourceLang, targetLang, useTransliteration, toast]);
  
  const availableTargetLangs = useTransliteration ? [transliterationTarget] : languages.filter(l => l.value !== sourceLang);

  useEffect(() => {
    if (useTransliteration) {
        setTargetLang(transliterationTarget.value);
    } else {
        // If current target is the transliteration one, switch back to a valid language
        if (targetLang === transliterationTarget.value) {
            const newTarget = languages.find(l => l.value !== sourceLang)?.value || 'Hindi';
            setTargetLang(newTarget);
        }
    }
  }, [useTransliteration, sourceLang, targetLang]);


  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card gap-4 flex-wrap shadow-sm">
        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <Label htmlFor="source-lang" className="mb-1 text-xs text-muted-foreground">From</Label>
                <Select value={sourceLang} onValueChange={setSourceLang} disabled={useTransliteration}>
                    <SelectTrigger className="w-[140px]" id="source-lang">
                        <SelectValue placeholder="Source Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} disabled={lang.value === targetLang}>
                            {lang.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button variant="ghost" size="icon" className="mt-5" onClick={handleSwapLanguages} disabled={useTransliteration}>
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
            <div className="flex flex-col">
                <Label htmlFor="target-lang" className="mb-1 text-xs text-muted-foreground">To</Label>
                <Select value={targetLang} onValueChange={setTargetLang} disabled={useTransliteration}>
                    <SelectTrigger className="w-[140px]" id="target-lang">
                        <SelectValue placeholder="Target Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTargetLangs.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} disabled={lang.value === sourceLang}>
                            {lang.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="flex items-center space-x-2 pt-5">
            <Switch
                id="transliteration-mode"
                checked={useTransliteration}
                onCheckedChange={setUseTransliteration}
            />
            <Label htmlFor="transliteration-mode">Transliterate to Hindi (Roman)</Label>
        </div>
      </header>

      <MessageList messages={messages} />
      
      <MessageForm onSendMessage={handleSendMessage} isSending={isSending} />
    </div>
  );
}
