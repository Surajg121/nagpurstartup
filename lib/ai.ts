import Groq from "groq-sdk";
import { unstable_cache } from "next/cache";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.1-8b-instant";

// Writes a full news article from a raw headline + content.
// Returns title, excerpt and full article body as JSON.
export async function writeNewsArticle(
  headline: string,
  rawContent: string,
  source: string
): Promise<{ title: string; excerpt: string; content: string } | null> {
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are an original news journalist at Nagpur Startup Hub, covering India's startup ecosystem with a focus on Nagpur and central India.

Your job is to write a COMPLETELY ORIGINAL article based ONLY on the facts from the source material below. You must:
- Write every sentence from scratch in your own voice. Do NOT copy or closely paraphrase the source.
- Use the facts (names, numbers, dates, company names) but express them in entirely new sentences and structure.
- Craft a fresh headline that is different from the original title.
- Lead with the most newsworthy fact, then add context, then significance.
- Do not use em dashes. Do not use passive voice excessively. Keep it punchy and direct.
- Never fabricate facts not present in the source.

Return ONLY a valid JSON object with exactly three fields:
- title: your original headline (must differ from the source headline)
- excerpt: 1-2 original sentences summarising the story
- content: the full original article body (4 paragraphs, ~300 words), no heading, paragraphs separated by newlines`,
        },
        {
          role: "user",
          content: `Source headline: ${headline}\nSource: ${source}\nSource content:\n${rawContent}\n\nWrite a completely original article based on these facts.`,
        },
      ],
      temperature: 0.85,
      max_tokens: 900,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const parsed = JSON.parse(text);
    console.log("[ai] generated keys:", Object.keys(parsed));
    console.log("[ai] content preview:", parsed.content?.slice(0, 100));
    return parsed;
  } catch (e: any) {
    console.error("[ai] writeNewsArticle error:", e?.message ?? e);
    return null;
  }
}

// Generates a 1-2 sentence teaser for an article.
// Cached per post for 24 hours so Groq is only called once per article.
export const getPostSummary = unstable_cache(
  async (_postId: string, title: string, category: string): Promise<string> => {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: `Write a short, engaging 1-2 sentence teaser for an article titled "${title}" in the "${category}" category on a startup news website. Be specific and compelling. No fluff. No quotes. No em dashes.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 80,
      });
      return completion.choices[0]?.message?.content?.trim() ?? "";
    } catch {
      return "";
    }
  },
  ["post-summary"],
  { revalidate: 86400 }
);
