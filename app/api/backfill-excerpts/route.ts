import { NextResponse } from "next/server";
import { getPosts, updatePostExcerpt } from "@/lib/notion";
import { getPostSummary } from "@/lib/ai";

export async function GET(req: Request) {
  // Block in production unless the cron secret is present
  if (process.env.NODE_ENV === "production") {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const posts = await getPosts();

    // Only process posts that have no excerpt yet
    const missing = posts.filter((p: any) => !p.excerpt);

    if (!missing.length) {
      return NextResponse.json({ message: "All posts already have excerpts.", total: posts.length });
    }

    const results: string[] = [];

    for (const post of missing) {
      if (!post.title || !post.id) continue;

      const category = post.category ?? "Startup";
      const excerpt = await getPostSummary(post.id, post.title, category);

      if (!excerpt) {
        results.push(`Skipped (AI returned empty): ${post.title}`);
        continue;
      }

      await updatePostExcerpt(post.id, excerpt);
      results.push(`Updated: ${post.title}`);

      // Small delay to avoid hitting Groq rate limits
      await new Promise((r) => setTimeout(r, 1500));
    }

    return NextResponse.json({ success: true, processed: missing.length, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
