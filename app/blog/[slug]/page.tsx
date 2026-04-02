import { getPostBySlug, getPageContent } from "@/lib/notion";
import Image from "next/image";

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = (await getPostBySlug(slug)) as any;

  if (!post) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Post not found
      </div>
    );
  }

  const content = await getPageContent(post.id);

  const coverFile = post.properties?.coverImage?.files?.[0];
  const coverUrl = coverFile?.type === "file"
    ? coverFile.file.url
    : coverFile?.type === "external"
    ? coverFile.external.url
    : null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-5xl font-extrabold mb-4 leading-tight">
        {post.properties.Title.title[0]?.plain_text}
      </h1>

      {/* Meta */}
      <p className="text-gray-500 mb-6 text-sm md:text-base">
        {post.properties.publishedDate.date?.start} • {post.properties.category.select?.name}
      </p>

      {/* Cover image */}
      {coverUrl && (
        <div className="relative w-full h-72 rounded-lg overflow-hidden mb-8">
          <Image
            src={coverUrl}
            alt="Cover"
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
            unoptimized
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-none text-gray-800 text-base leading-relaxed">
        {content.map((block: any) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p key={block.id} className="mb-5">
                  {block.paragraph.rich_text.map((t: any) => t.plain_text).join("")}
                </p>
              );
            case "heading_1":
              return (
                <h1 key={block.id} className="text-3xl font-bold mt-10 mb-4">
                  {block.heading_1.rich_text.map((t: any) => t.plain_text).join("")}
                </h1>
              );
            case "heading_2":
              return (
                <h2 key={block.id} className="text-2xl font-bold mt-8 mb-3">
                  {block.heading_2.rich_text.map((t: any) => t.plain_text).join("")}
                </h2>
              );
            case "heading_3":
              return (
                <h3 key={block.id} className="text-xl font-semibold mt-6 mb-2">
                  {block.heading_3.rich_text.map((t: any) => t.plain_text).join("")}
                </h3>
              );
            case "bulleted_list_item":
              return (
                <ul key={block.id} className="list-disc list-inside mb-2 ml-4">
                  <li>{block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join("")}</li>
                </ul>
              );
            case "numbered_list_item":
              return (
                <ol key={block.id} className="list-decimal list-inside mb-2 ml-4">
                  <li>{block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join("")}</li>
                </ol>
              );
            case "quote":
              return (
                <blockquote key={block.id} className="border-l-4 border-red-600 pl-4 italic text-gray-600 my-6">
                  {block.quote.rich_text.map((t: any) => t.plain_text).join("")}
                </blockquote>
              );
            default:
              return null;
          }
        })}
      </div>

    </main>
  );
}