import OpenAI from "openai";
import { unstable_cache } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generates a 1-2 sentence teaser for an article.
// Cached per post for 24 hours so OpenAI is only called once per article.
export const getPostSummary = unstable_cache(
  async (postId: string, title: string, category: string): Promise<string> => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write short, engaging 1-2 sentence article teasers for a startup news and insights website. Be specific, compelling, and concise. No fluff. No quotes around the output.",
          },
          {
            role: "user",
            content: `Write a 1-2 sentence teaser for an article titled "${title}" in the "${category}" category.`,
          },
        ],
        max_tokens: 80,
        temperature: 0.7,
      });
      return completion.choices[0]?.message?.content?.trim() ?? "";
    } catch {
      return "";
    }
  },
  ["post-summary"],
  { revalidate: 86400 } // 24 hours
);
