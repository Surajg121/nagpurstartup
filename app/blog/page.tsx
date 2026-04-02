import { getPosts } from "@/lib/notion";
import Link from "next/link";

export default async function Home() {
  const posts = await getPosts();

  const filterByCategory = (category: string) =>
    posts.filter((post: any) => post.category?.toLowerCase() === category.toLowerCase()).slice(0, 2);

  const insights = filterByCategory("Insights");
  const founders = filterByCategory("Founder Stories");
  const news = filterByCategory("Startup News");
  const jobs = filterByCategory("Job Opportunities");

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Nagpur Startup Hub 🚀
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Your go-to destination for insights, stories, news, and opportunities from Nagpur’s growing startup ecosystem.
        </p>
      </section>

      {/* Insights */}
      {insights.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="p-6 border rounded-lg shadow hover:shadow-lg transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                <p className="text-gray-700 line-clamp-3">{post.preview || "Read the full insight on Nagpur startups..."}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Founder Stories */}
      {founders.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Founder Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {founders.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="p-6 border rounded-lg shadow hover:shadow-lg transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                <p className="text-gray-700 line-clamp-3">{post.preview || "Read the founder story..."}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Startup News */}
      {news.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Startup News</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {news.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="p-6 border rounded-lg shadow hover:shadow-lg transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                <p className="text-gray-700 line-clamp-3">{post.preview || "Read the latest news..."}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Job Opportunities */}
      {jobs.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Job Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="p-6 border rounded-lg shadow hover:shadow-lg transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition">{post.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{post.date}</p>
                <p className="text-gray-700 line-clamp-3">{post.preview || "Explore the opportunity..."}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}