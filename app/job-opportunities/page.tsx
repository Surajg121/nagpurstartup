import { getPosts } from "@/lib/notion";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup Jobs in Nagpur",
  description:
    "Find curated job opportunities at Nagpur-based startups. Roles in tech, marketing, operations, sales, and more — from the heart of central India's startup scene.",
  keywords: [
    "startup jobs Nagpur", "jobs in Nagpur startups", "Nagpur tech jobs",
    "startup hiring Nagpur", "Nagpur job opportunities", "central India startup jobs",
    "Vidarbha startup jobs", "Nagpur employment startups",
  ],
  alternates: { canonical: "https://nagpurstartup.in/job-opportunities" },
  openGraph: {
    title: "Startup Jobs in Nagpur | Nagpur Startup Hub",
    description: "Curated startup job openings in Nagpur — find your next role in central India's fastest-growing ecosystem.",
    url: "https://nagpurstartup.in/job-opportunities",
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
  "from-slate-600 to-slate-800",
  "from-rose-700 to-rose-900",
  "from-indigo-600 to-indigo-800",
  "from-emerald-600 to-emerald-800",
  "from-amber-600 to-amber-800",
  "from-violet-600 to-violet-800",
];

export default async function JobOpportunitiesPage() {
  const allPosts = await getPosts();
  const jobs = allPosts.filter((p: any) =>
    p.category?.toLowerCase().includes("job")
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header banner */}
      <div className="bg-black text-white border-b border-red-700">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:gap-8">
          <div className="shrink-0">
            <span className="bg-red-700 text-white text-xs font-bold uppercase px-3 py-1 tracking-widest inline-block mb-2">
              Jobs
            </span>
            <h1
              className="text-2xl md:text-3xl font-extrabold leading-tight"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Nagpur Job Opportunities
            </h1>
          </div>
          <div className="hidden sm:block w-px h-12 bg-gray-600 shrink-0" />
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-2 sm:mt-0">
            Curated roles from Nagpur-based startups and growing companies.
            Find your next opportunity in the heart of central India.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-gray-800">{jobs.length}</span>{" "}
            {jobs.length === 1 ? "opening" : "openings"} in Nagpur
          </p>
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Actively Hiring
          </span>
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-24 bg-white rounded-sm shadow-sm">
            <p className="text-4xl mb-3">💼</p>
            <p className="text-gray-500 text-lg font-medium">No openings right now.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon for new opportunities.</p>
          </div>
        )}

        {/* Job cards grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job: any, i: number) => (
            <li key={job.id}>
              <Link
                href={`/blog/${job.slug}`}
                className="flex flex-col h-full bg-white rounded-sm shadow-sm border border-gray-200 hover:border-red-400 hover:shadow-md transition group p-5"
              >
                {/* Top row: logo + badges */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`relative shrink-0 w-12 h-12 rounded-sm overflow-hidden ${
                      job.cover ? "" : `bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`
                    }`}
                  >
                    {job.cover && (
                      <Image
                        src={job.cover}
                        alt={job.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      Nagpur
                    </span>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      Startup
                    </span>
                  </div>
                </div>

                {/* Job title */}
                <h2
                  className="text-gray-900 font-bold text-lg leading-snug group-hover:text-red-700 transition flex-1"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {job.title}
                </h2>

                {/* Footer row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-gray-400 text-xs">Posted {timeAgo(job.date)}</span>
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wide group-hover:underline">
                    View Job &rarr;
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
