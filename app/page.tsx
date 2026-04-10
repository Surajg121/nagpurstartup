import { getPosts } from "@/lib/notion";
import Link from "next/link";
import Image from "next/image";

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

function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="bg-pink-600 text-white text-xs font-bold uppercase px-2 py-0.5 tracking-wider inline-block">
      {label}
    </span>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 border-b-2 border-gray-200 pb-2">
      <span className="bg-pink-600 text-white text-sm font-bold uppercase px-3 py-1 tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
        {title}
      </span>
    </div>
  );
}

const GRADIENTS = [
  "from-slate-700 to-slate-900",
  "from-rose-800 to-rose-950",
  "from-indigo-700 to-indigo-900",
  "from-emerald-700 to-emerald-900",
  "from-amber-700 to-amber-900",
  "from-violet-700 to-violet-900",
];
function grad(i: number) { return GRADIENTS[Math.abs(i) % GRADIENTS.length]; }

function CategorySection({ title, posts, offset }: { title: string; posts: any[]; offset: number }) {
  if (posts.length === 0) return null;
  const [main, ...rest] = posts;
  return (
    <section className="bg-white rounded-sm shadow-sm p-5">
      <SectionTitle title={title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href={`/blog/${main.slug}`} className="block group">
          <div
            className={`${main.cover ? "" : `bg-gradient-to-br ${grad(offset)}`} h-44 flex flex-col justify-end p-4 rounded-sm relative overflow-hidden`}
          >
            {main.cover && (
              <Image src={main.cover} alt={main.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" unoptimized />
            )}
            <div className="relative z-10 bg-gradient-to-t from-black/70 to-transparent absolute inset-0" />
            <div className="relative z-20">
              <CategoryBadge label={main.category || title} />
              <h3 className="text-white font-bold text-lg leading-snug mt-1 group-hover:text-pink-300 transition" style={{ fontFamily: "var(--font-oswald)" }}>
                {main.title}
              </h3>
              <p className="text-gray-300 text-xs mt-1">{timeAgo(main.date)}</p>
            </div>
          </div>
        </Link>
        <ul className="space-y-3">
          {rest.slice(0, 4).map((post: any) => (
            <li key={post.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <Link href={`/blog/${post.slug}`} className="group">
                <span className="text-pink-600 text-xs font-bold uppercase">{post.category}</span>
                <p className="text-sm font-semibold leading-snug group-hover:text-red-700 transition mt-0.5" style={{ fontFamily: "var(--font-oswald)" }}>{post.title}</p>
                <p className="text-gray-400 text-xs">{timeAgo(post.date)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-right">
        <Link href={`/${title.toLowerCase().replace(/\s+/g, "-")}`} className="text-red-700 text-sm font-bold uppercase hover:underline tracking-wide">
          More {title} →
        </Link>
      </div>
    </section>
  );
}

const WHAT_WE_OFFER = [
  {
    href: "/insights",
    icon: "💡",
    label: "Insights",
    desc: "Trend analysis, expert perspectives, and deep dives to help you understand where the startup world is heading.",
  },
  {
    href: "/founder-stories",
    icon: "🧑‍💼",
    label: "Founder Stories",
    desc: "First-hand journeys from people who are building: the struggles, pivots, and wins that textbooks never cover.",
  },
  {
    href: "/startup-news",
    icon: "📰",
    label: "Startup News",
    desc: "Funding rounds, product launches, policy updates. Everything happening in the ecosystem, curated for you.",
  },
  {
    href: "/job-opportunities",
    icon: "💼",
    label: "Jobs in Nagpur",
    desc: "Curated roles from Nagpur-based startups. Find your next opportunity in the heart of central India.",
  },
];

export default async function Home() {
  const posts = await getPosts();

  const byCategory = (cat: string) =>
    posts.filter((p: any) => p.category?.toLowerCase().includes(cat.toLowerCase()));

  const insights = byCategory("insights");
  const founders = byCategory("founder");
  const news = byCategory("news");
  const jobs = byCategory("job");

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Breaking ticker bar */}
      <div className="bg-red-700 text-white text-xs py-1 px-4 flex gap-2 items-center overflow-hidden">
        <span className="font-bold uppercase tracking-widest shrink-0 mr-2">Latest</span>
        <span className="truncate">
          {posts.slice(0, 5).map((p: any) => p.title).join("  •  ")}
        </span>
      </div>

      {/* Welcome + Latest row */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Welcome section - 2/3 width */}
          <div style={{ backgroundColor: "#1a2f5e" }} className="lg:col-span-2 text-white rounded-sm shadow-md p-6 md:p-8">
            <span className="bg-orange-500 text-white text-xs font-bold uppercase px-3 py-1 tracking-widest inline-block mb-4">
              Welcome
            </span>
            <h2
              className="text-2xl md:text-4xl font-extrabold leading-tight mb-3"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Nagpur is Building. We are Telling the Story.
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              With over 1,200 registered startups and a city ranked among India's top 25 emerging startup ecosystems,
              Nagpur is no longer just central India's orange capital. It is becoming a hub for technology,
              logistics, agri-tech, and manufacturing innovation. Nagpur Startup Hub exists to document, amplify,
              and celebrate this growth, for founders, job seekers, investors, and curious minds alike.
            </p>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { number: "1,200+", label: "Registered Startups" },
                { number: "#23", label: "Startup City in India" },
                { number: "Rs.5,000 Cr", label: "Growth Hub Investment" },
                { number: "4 Sectors", label: "Covered on this Hub" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-sm px-3 py-4 text-center">
                  <p className="text-orange-400 text-xl font-extrabold" style={{ fontFamily: "var(--font-oswald)" }}>
                    {stat.number}
                  </p>
                  <p className="text-gray-300 text-xs uppercase tracking-wide mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* What we offer cards */}
            <div className="grid grid-cols-2 gap-3">
              {WHAT_WE_OFFER.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white/5 border border-white/10 rounded-sm p-4 hover:bg-white/10 hover:border-orange-400 transition group"
                >
                  <span className="text-xl">{item.icon}</span>
                  <h3
                    className="text-white font-bold text-sm mt-1 mb-1 group-hover:text-orange-400 transition"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    {item.label}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest sidebar - 1/3 width */}
          <aside className="bg-white rounded-sm shadow-sm p-5">
            <SectionTitle title="Latest" />
            <ul className="space-y-4">
              {posts.slice(0, 6).map((post: any, i: number) => (
                <li key={post.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className={`bg-gradient-to-br ${grad(i + 1)} w-16 h-16 rounded-sm shrink-0`} />
                  <Link href={`/blog/${post.slug}`} className="group">
                    <span className="text-pink-600 text-xs font-bold uppercase">{post.category}</span>
                    <p className="text-sm font-semibold leading-snug group-hover:text-red-700 transition" style={{ fontFamily: "var(--font-oswald)" }}>{post.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{timeAgo(post.date)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

        </div>
      </div>

      {/* Category sections */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategorySection title="Insights" posts={insights} offset={1} />
          <CategorySection title="Founder Stories" posts={founders} offset={2} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategorySection title="Startup News" posts={news} offset={3} />
          <CategorySection title="Job Opportunities" posts={jobs} offset={4} />
        </div>
      </div>
    </div>
  );
}