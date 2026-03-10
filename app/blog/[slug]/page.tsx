import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import BlogPostClient from './blog-post-client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      excerpt: true,
      coverImage: true,
    },
  });

  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [post.coverImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
