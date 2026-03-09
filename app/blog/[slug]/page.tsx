import TipTapImageExtension from '@tiptap/extension-image';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { format } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      author: true,
    },
  });

  if (!post) return null;

  await prisma.$executeRaw`UPDATE blog_post SET "viewCount" = "viewCount" + 1 WHERE id = ${post.id}`;

  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: 'PUBLISHED' },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      metaImage: true,
      coverImage: true,
    },
  });

  if (!post) return {};

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || undefined,
      images: [post.metaImage || post.coverImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || undefined,
      images: [post.metaImage || post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  let contentHtml = '';
  try {
    const parsedContent = JSON.parse(post.content || '{}');
    contentHtml = DOMPurify.sanitize(
      generateHTML(parsedContent, [StarterKit, TipTapImageExtension]),
    );
  } catch {
    contentHtml = '<p>Unable to render content</p>';
  }

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: 'PUBLISHED',
      categoryId: post.categoryId,
      NOT: { id: post.id },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  return (
    <article className='min-h-screen bg-background'>
      <div className='relative h-[50vh] min-h-[400px]'>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent' />
      </div>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10'>
        <div className='bg-card border rounded-2xl p-6 sm:p-10 shadow-lg'>
          <div className='flex items-center gap-2 mb-4'>
            <Link
              href={`/blog?category=${post.category.slug}`}
              className='text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors'
            >
              {post.category.name}
            </Link>
            {post.featured && (
              <span className='text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-1 rounded-full'>
                Featured
              </span>
            )}
          </div>

          <h1 className='font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6'>
            {post.title}
          </h1>

          <div className='flex items-center gap-4 mb-8 pb-8 border-b'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden'>
                {post.author.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className='object-cover'
                  />
                ) : (
                  <span className='text-sm font-bold text-primary'>
                    {post.author.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className='font-medium'>{post.author.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {post.publishedAt
                    ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                    : ''}
                </p>
              </div>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-8'>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className='text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full hover:bg-muted/80 transition-colors'
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div
            className='prose prose-lg max-w-none'
            // biome-ignore lint/security/noDangerouslySetInnerHtml: this is fine
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>

        {relatedPosts.length > 0 && (
          <div className='mt-16 pb-16'>
            <h2 className='font-display text-2xl font-bold mb-6'>
              Related Posts
            </h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className='group block rounded-xl border overflow-hidden hover:border-primary/30 transition-colors'
                >
                  <div className='relative h-40'>
                    <Image
                      src={related.coverImage}
                      alt={related.title}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                  <div className='p-4'>
                    <h3 className='font-semibold line-clamp-2 group-hover:text-primary transition-colors'>
                      {related.title}
                    </h3>
                    <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
