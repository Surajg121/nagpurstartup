import { Client, DatabaseObjectResponse } from "@notionhq/client";
import type { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { unstable_cache } from "next/cache";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// Cache the data source ID for 1 hour - it never changes
const getDataSourceId = unstable_cache(
  async (): Promise<string> => {
    const db = await notion.databases.retrieve({ database_id: databaseId });
    const fullDb = db as DatabaseObjectResponse;
    const dataSourceId = fullDb.data_sources?.[0]?.id;
    if (!dataSourceId) throw new Error("No data source found for this database.");
    return dataSourceId;
  },
  ["notion-data-source-id"],
  { revalidate: 3600 }
);

// Cache post list for 60 seconds - fast revalidation so new posts appear quickly
export const getPosts = unstable_cache(
  async () => {
    const dataSourceId = await getDataSourceId();
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: "published",
        checkbox: { equals: true },
      },
      sorts: [
        {
          property: "publishedDate",
          direction: "descending",
        },
      ],
    });

    return response.results.map((post: any) => {
      const coverFile = post.properties.coverImage?.files?.[0];
      const cover =
        coverFile?.type === "file"
          ? coverFile.file.url
          : coverFile?.type === "external"
          ? coverFile.external.url
          : null;

      return {
        id: post.id,
        title: post.properties.Title.title[0]?.plain_text,
        slug: post.properties.Slug.rich_text[0]?.plain_text,
        category: post.properties.category.select?.name,
        date: post.properties.publishedDate.date?.start,
        cover,
        excerpt: post.properties.Excerpt?.rich_text?.[0]?.plain_text ?? "",
      };
    });
  },
  ["notion-posts"],
  { revalidate: 60 }
);

export async function createNewsPost({
  title,
  slug,
  excerpt,
  content,
  date,
}: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
}) {
  // Split content into paragraphs and build Notion blocks
  const paragraphs = content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const children: BlockObjectRequest[] = paragraphs.map((para) => ({
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [{ type: "text", text: { content: para } }],
    },
  }));

  await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Title: { title: [{ text: { content: title } }] },
      Slug: { rich_text: [{ text: { content: slug } }] },
      category: { select: { name: "Startup News" } },
      publishedDate: { date: { start: date } },
      published: { checkbox: true },
      Excerpt: { rich_text: [{ text: { content: excerpt } }] },
    },
    children,
  } as any);
}

// Save a generated excerpt back to the Notion page so it persists permanently.
export async function updatePostExcerpt(pageId: string, excerpt: string) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Excerpt: { rich_text: [{ type: "text", text: { content: excerpt } }] },
    },
  } as any);
}

export async function getPostBySlug(slug: string) {
  if (!slug) return null;
  const posts = await getPosts();
  const matched = posts.find((p: any) => p.slug === slug);
  if (!matched) return null;

  // Fetch the raw page object so the blog detail page can read all properties
  const page = await notion.pages.retrieve({ page_id: matched.id });
  return page;
}

// Cache page content for 60 seconds per page ID
export const getPageContent = unstable_cache(
  async (pageId: string) => {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    return blocks.results;
  },
  ["notion-page-content"],
  { revalidate: 60 }
);