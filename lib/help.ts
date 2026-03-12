import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/help');

interface ArticleMeta {
  slug: string;
  title: string;
  category: string;
  description: string;
}

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  return fs
    .readdirSync(contentDirectory)
    .filter((file) => file.endsWith('.md'));
}

export function getArticleBySlug(
  slug: string,
): { content: string; meta: ArticleMeta } | null {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(fileContents);

  return {
    content,
    meta: {
      slug: realSlug,
      title: data.title,
      category: data.category,
      description: data.description,
    },
  };
}

export function getAllArticles(): ArticleMeta[] {
  const slugs = getArticleSlugs();
  return slugs
    .map((slug) => {
      const article = getArticleBySlug(slug);
      return article?.meta ?? null;
    })
    .filter((article): article is ArticleMeta => article !== null);
}
