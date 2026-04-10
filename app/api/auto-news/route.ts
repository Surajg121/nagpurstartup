import { NextResponse } from "next/server";
import { writeNewsArticle } from "@/lib/ai";
import { createNewsPost, getPosts } from "@/lib/notion";
import Parser from "rss-parser";

const parser = new Parser({ timeout: 10000 });

const RSS_FEEDS = [
  { name: "Inc42",     url: "https://inc42.com/feed/" },
  { name: "YourStory", url: "https://yourstory.com/feed" },
  { name: "Entrackr",  url: "https://entrackr.com/feed/" },
  { name: "VCCircle",  url: "https://www.vccircle.com/feed" },
];

const NAGPUR_KEYWORDS    = ["nagpur"];
const MAHARASHTRA_KEYWORDS = ["maharashtra", "pune", "nashik", "aurangabad"];
const INDIA_KEYWORDS     = ["india", "indian", "bengaluru", "bangalore", "hyderabad", "delhi", "mumbai"];
const EXCLUDE_KEYWORDS   = [
  "sensex", "nifty", "stock market", "share market", "mutual fund",
  "cryptocurrency", "bitcoin", "wall street", "china", "uae",
  "daily roundup", "weekly roundup", "news roundup", "startup news and updates",
  "roundup for", "weekly digest", "daily digest", "this week in",
  "top stories of the day", "news of the day", "what happened today",
];

function scoreArticle(title: string, summary: string): number {
  const text = `${title} ${summary}`.toLowerCase();
  if (EXCLUDE_KEYWORDS.some((kw) => text.includes(kw))) return 0;
  if (NAGPUR_KEYWORDS.some((kw) => text.includes(kw))) return 3;
  if (MAHARASHTRA_KEYWORDS.some((kw) => text.includes(kw))) return 2;
  if (INDIA_KEYWORDS.some((kw) => text.includes(kw))) return 1;
  // RSS feeds are already startup-focused so India match is enough
  return 1;
}

function toSlug(title: string, date: string): string {
  return (
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60) +
    "-" + date.replace(/-/g, "")
  );
}

async function fetchStartupNews() {
  const allItems: any[] = [];

  await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        for (const item of parsed.items ?? []) {
          const title   = item.title?.trim() ?? "";
          const summary = item.contentSnippet ?? item.summary ?? "";
          const score   = scoreArticle(title, summary);
          if (score > 0) {
            allItems.push({
              title,
              content: summary,
              source: feed.name,
              pubDate: item.pubDate ?? "",
              _score: score,
            });
          }
        }
        console.log(`[auto-news] ${feed.name}: fetched ${parsed.items?.length ?? 0} items`);
      } catch (e: any) {
        console.error(`[auto-news] ${feed.name} failed:`, e.message);
      }
    })
  );

  // Only keep articles published in the last 48 hours
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const fresh = allItems.filter((a) => {
    if (!a.pubDate) return true; // keep if no date
    return new Date(a.pubDate).getTime() >= cutoff;
  });

  // Deduplicate across feeds — same story often appears on Inc42, YourStory, Entrackr
  const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "for", "of", "in", "to", "is", "its", "with", "on", "at", "by", "from", "as", "are", "was", "how", "what", "why", "but"]);

  function keyTerms(title: string): Set<string> {
    return new Set(
      title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/)
        .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
    );
  }

  function isSimilar(a: string, b: string): boolean {
    const termsA = keyTerms(a);
    const termsB = keyTerms(b);
    let shared = 0;
    termsA.forEach((t) => { if (termsB.has(t)) shared++; });
    const similarity = shared / Math.min(termsA.size, termsB.size);
    return similarity >= 0.5; // 50%+ shared key words = same story
  }

  const deduplicated: any[] = [];
  for (const article of fresh) {
    const isDupe = deduplicated.some((kept) => isSimilar(kept.title, article.title));
    if (!isDupe) deduplicated.push(article);
  }

  console.log(`[auto-news] ${allItems.length} total, ${fresh.length} within 24h, ${deduplicated.length} after deduplication`);

  // Sort: Nagpur first, Maharashtra second, India third, then newest first
  return deduplicated.sort((a, b) => b._score - a._score || new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

export async function GET(req: Request) {
  // In production, verify cron secret
  if (process.env.NODE_ENV === "production") {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const articles = await fetchStartupNews();
    if (!articles.length) {
      return NextResponse.json({ message: "No news articles found." });
    }

    // Get existing slugs to avoid duplicates
    const existingPosts = await getPosts();
    const existingSlugs = new Set(existingPosts.map((p: any) => p.slug));

    const today = new Date().toISOString().split("T")[0];
    const results: string[] = [];
    let published = 0;

    // Only attempt top 3 candidates — no point trying all 9
    const candidates = articles.slice(0, 3);

    for (const article of candidates) {
      if (published >= 2) break;

      const rawTitle = article.title?.replace(/ - .*$/, "").trim();
      const rawContent = [article.description, article.content]
        .filter(Boolean)
        .join("\n");

      if (!rawTitle || !rawContent) continue;

      const slug = toSlug(rawTitle, today);
      if (existingSlugs.has(slug)) {
        results.push(`Skipped (duplicate): ${rawTitle} [score:${article._score}]`);
        continue;
      }

      // Small delay between calls to avoid rate limit spikes
      if (published > 0) await new Promise((r) => setTimeout(r, 3000));

      const generated = await writeNewsArticle(rawTitle, rawContent, article.source?.name ?? "");
      if (!generated) {
        results.push(`Failed to generate: ${rawTitle} [score:${article._score}]`);
        break; // Stop on first AI failure — don't hammer the API
      }

      await createNewsPost({
        title: generated.title,
        slug,
        excerpt: generated.excerpt,
        content: generated.content,
        date: today,
      });

      results.push(`Published: ${generated.title} [score:${article._score}]`);
      published++;
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
