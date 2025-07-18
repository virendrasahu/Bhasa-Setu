// src/ai/flows/transliterate-input.ts
'use server';

/**
 * @fileOverview Translates user input from one language to another, supporting transliteration.
 *
 * - transliterateInput - A function that handles the transliteration process.
 * - TransliterateInputType - The input type for the transliterateInput function.
 * - TransliterateOutputType - The return type for the transliterateInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TransliterateInputSchema = z.object({
  text: z.string().describe('The text to transliterate.'),
  sourceLanguage: z.string().describe('The source language of the text.'),
  targetLanguage: z.string().describe('The target language to transliterate to (e.g., Hindi in Roman script).'),
});

export type TransliterateInputType = z.infer<typeof TransliterateInputSchema>;

const TransliterateOutputSchema = z.object({
  transliteratedText: z.string().describe('The transliterated text.'),
});

export type TransliterateOutputType = z.infer<typeof TransliterateOutputSchema>;

export async function transliterateInput(input: TransliterateInputType): Promise<TransliterateOutputType> {
  return transliterateFlow(input);
}

const transliteratePrompt = ai.definePrompt({
  name: 'transliteratePrompt',
  input: {schema: TransliterateInputSchema},
  output: {schema: TransliterateOutputSchema},
  prompt: `Translate the following message from {{sourceLanguage}} to {{targetLanguage}} and respond only with the translated message:\n\n{{text}}`,
});

const transliterateFlow = ai.defineFlow(
  {
    name: 'transliterateFlow',
    inputSchema: TransliterateInputSchema,
    outputSchema: TransliterateOutputSchema,
  },
  async input => {
    const {output} = await transliteratePrompt(input);
    return output!;
  }
);
