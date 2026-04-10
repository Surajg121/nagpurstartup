import { getPosts } from "@/lib/notion";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founder Stories",
  description:
    "First-hand journeys from startup founders — the real challenges, pivots, failures, and wins behind building a company from scratch.",
  keywords: [
    "founder stories India", "startup founder journey", "entrepreneur story",
    "startup success stories India", "building a startup India", "founder interviews",
  ],
  alternates: { canonical: "https://nagpurstartup.in/founder-stories" },
  openGraph: {
    title: "Founder Stories | Nagpur Startup Hub",
    description: "Real journeys from founders: the struggles, pivots, and wins that textbooks never cover.",
    url: "https://nagpurstartup.in/founder-stories",
  },
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

const GRADIENTS = [
  "from-slate-700 to-slate-900",
  "from-rose-800 to-rose-950",
  "from-indigo-700 to-indigo-900",
  "from-emerald-700 to-emerald-900",
  "from-amber-700 to-amber-900",
  "from-violet-700 to-violet-900",
];

export default async function FounderStoriesPage() {
  const allPosts = await getPosts();
  const posts = allPosts.filter((p: any) =>
    p.category?.toLowerCase().includes("founder")
  );

  const postsWithSummaries = posts.map((post: any) => ({
    ...post,
    summary: post.excerpt ?? "",
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Page hero / description banner */}
      <div className="bg-black text-white border-b border-red-700">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:gap-8">
          <div className="shrink-0">
            <span className="bg-red-700 text-white text-xs font-bold uppercase px-3 py-1 tracking-widest inline-block mb-2">
              Founder Stories
            </span>
            <h1
              className="text-2xl md:text-3xl font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Founder Stories
            </h1>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-600 shrink-0" />
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-2 sm:mt-0">
            Real journeys from the people building startups. First-hand accounts
            of challenges faced, lessons learned, and milestones celebrated by
            founders across industries.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-24 text-lg">
            No Founder Stories published yet. Check back soon!
          </p>
        )}

        {/* Article list */}
        <ul className="divide-y divide-gray-200 bg-white rounded-sm shadow-sm">
          {postsWithSummaries.map((post: any, i: number) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-4 px-5 py-4 group hover:bg-gray-50 transition"
              >
                {/* Text side */}
                <div className="flex-1 min-w-0">
                  <span className="text-red-700 text-xs font-bold uppercase tracking-wide">
                    Founder Stories
                  </span>
                  <h2
                    className="text-gray-900 font-bold text-base leading-snug mt-0.5 group-hover:text-red-700 transition line-clamp-2"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    {post.title}
                  </h2>
                  {post.summary && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{post.summary}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">{timeAgo(post.date)}</p>
                </div>

                {/* Thumbnail */}
                <div
                  className={`relative shrink-0 w-20 h-20 rounded-sm overflow-hidden ${
                    post.cover ? "" : `bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`
                  }`}
                >
                  {post.cover && (
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
