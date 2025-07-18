export type Message = {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTranslating?: boolean;
};
