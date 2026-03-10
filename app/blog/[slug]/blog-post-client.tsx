'use client';

import TipTapImageExtension from '@tiptap/extension-image';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { format } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, Calendar, Eye, Tag, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublicBlogPost } from '@/services/blog';

function BlogPostSkeleton() {
  return (
    <div className='min-h-screen bg-background'>
      <section className='relative min-h-[60vh] bg-muted animate-pulse' />
      <section className='py-16'>
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6'>
          <Skeleton className='h-4 w-24 rounded-full' />
          <Skeleton className='h-12 w-3/4' />
          <Skeleton className='h-6 w-1/2' />
          <div className='flex items-center gap-3 pt-2'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>
          </div>
          <div className='space-y-3 pt-6'>
            {[...Array(8)].map((_, i) => (
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                key={i}
                className={`h-4 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const { data: post, isPending, isError } = usePublicBlogPost(slug);

  const contentHtml = useMemo(() => {
    if (!post?.content) return '';
    try {
      const parsed = JSON.parse(post.content);
      return DOMPurify.sanitize(
        generateHTML(parsed, [StarterKit, TipTapImageExtension]),
      );
    } catch {
      return '<p>Unable to render content</p>';
    }
  }, [post?.content]);

  if (isPending) return <BlogPostSkeleton />;
  if (isError || !post) return notFound();

  return (
    <article className='min-h-screen bg-background'>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className='relative min-h-[65vh] flex items-end overflow-hidden'>
        {/* Background image */}
        <div className='absolute inset-0 z-0'>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/10' />
        </div>

        {/* Back button */}
        <div className='absolute top-6 left-0 right-0 z-10'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 text-xs font-medium text-white/80 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full transition-all'
            >
              <ArrowLeft className='w-3.5 h-3.5' />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Hero text */}
        <div className='relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14'>
          <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
            {/* Category + featured */}
            <div className='flex items-center gap-2 mb-4'>
              {post.category && (
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className='text-xs font-semibold text-primary bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-primary/30 transition-colors'
                >
                  {post.category.name}
                </Link>
              )}
              {post.featured && (
                <span className='text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full'>
                  Featured
                </span>
              )}
            </div>

            <h1 className='font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 max-w-3xl'>
              {post.title}
              <span className='text-primary'>.</span>
            </h1>

            {post.excerpt && (
              <p className='text-base text-white/70 max-w-2xl leading-relaxed'>
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Meta bar ─────────────────────────────────────────────────────── */}
      <section className='border-y border-border bg-primary/5'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-wrap items-center justify-between gap-4 py-4'>
            {/* Author */}
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0'>
                {post.author?.image ? (
                  <Image
                    src={post.author.image}
                    alt={post.author.name || ''}
                    width={36}
                    height={36}
                    className='object-cover'
                  />
                ) : (
                  <span className='text-xs font-bold text-primary'>
                    {post.author?.name?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <div>
                <div className='flex items-center gap-1.5'>
                  <User className='w-3 h-3 text-muted-foreground' />
                  <p className='text-sm font-semibold'>{post.author?.name}</p>
                </div>
                {post.publishedAt && (
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='w-3 h-3 text-muted-foreground' />
                    <p className='text-xs text-muted-foreground'>
                      {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side — views + tags */}
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Eye className='w-3.5 h-3.5' />
                <span>{post.viewCount.toLocaleString()} views</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className='hidden sm:flex items-center gap-1.5'>
                  <Tag className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
                  <div className='flex flex-wrap gap-1.5'>
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className='text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors'
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Body content ─────────────────────────────────────────────────── */}
      <section className='py-16 md:py-20'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-3 mb-10'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Article
            </span>
          </div>

          <div
            className='prose prose-lg max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic
              prose-blockquote:text-muted-foreground
              prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-2xl
              prose-strong:text-foreground
              prose-hr:border-border'
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Mobile tags */}
          {post.tags && post.tags.length > 0 && (
            <div className='sm:hidden flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border'>
              <Tag className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className='text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors'
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
