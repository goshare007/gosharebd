'use client';

import { format } from 'date-fns';
import { Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { type BlogPost, usePublicBlogPosts } from '@/services/blog';

function ArticleCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group flex flex-col rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className='relative h-48 overflow-hidden'>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/30 to-transparent' />
        <div className='absolute top-3 left-3'>
          <span className='text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-full'>
            {post.category?.name}
          </span>
        </div>
      </div>

      <div className='p-5 flex flex-col flex-1'>
        <h3 className='font-display text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2'>
          {post.title}
        </h3>
        <p className='text-sm text-muted-foreground line-clamp-2 mb-4 flex-1'>
          {post.excerpt}
        </p>

        <div className='flex items-center justify-between mt-auto pt-3 border-t border-border'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden'>
              {post.author?.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || ''}
                  width={24}
                  height={24}
                  className='object-cover'
                />
              ) : (
                <span className='text-xs font-bold text-primary'>
                  {post.author?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <span className='text-xs font-medium'>{post.author?.name}</span>
          </div>
          <time className='text-xs text-muted-foreground'>
            {post.publishedAt
              ? format(new Date(post.publishedAt), 'MMM d, yyyy')
              : ''}
          </time>
        </div>
      </div>
    </Link>
  );
}

function ArticlesSkeleton() {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
          key={i}
          className='rounded-2xl border border-border overflow-hidden'
        >
          <Skeleton className='h-48 w-full' />
          <div className='p-5 space-y-3'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
            <div className='flex items-center justify-between pt-3 border-t border-border'>
              <Skeleton className='h-3 w-20' />
              <Skeleton className='h-3 w-16' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tag }: { tag: string }) {
  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5'>
        <Tag className='w-8 h-8 text-primary' />
      </div>
      <h2 className='text-xl font-bold mb-2'>No posts with this tag</h2>
      <p className='text-sm text-muted-foreground max-w-xs mb-6'>
        There are no published posts tagged with &quot;{tag}&quot; yet. Check
        back later for new content.
      </p>
      <Link
        href='/blog'
        className='text-sm font-medium text-primary hover:underline'
      >
        Browse all posts
      </Link>
    </div>
  );
}

export default function BlogTagPage() {
  const params = useParams();
  const tag = params.tag as string;

  const {
    data: postsData,
    isPending,
    isError,
  } = usePublicBlogPosts({ tag, limit: 12 });

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <section className='border-b border-border bg-primary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20'>
          <div className='flex items-center gap-3 mb-4'>
            <Link
              href='/blog'
              className='text-xs font-semibold tracking-[0.2em] uppercase text-primary hover:underline'
            >
              Blog
            </Link>
            <span className='text-xs text-muted-foreground'>/</span>
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground'>
              Tag
            </span>
          </div>

          <div className='flex items-center gap-3'>
            <Tag className='w-8 h-8 text-primary' />
            <h1 className='font-display text-4xl md:text-5xl font-bold leading-tight'>
              {tag}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {isPending ? (
          <ArticlesSkeleton />
        ) : isError ? (
          <div className='text-center py-24'>
            <p className='text-muted-foreground'>
              Failed to load posts. Please try again.
            </p>
          </div>
        ) : postsData?.posts.length === 0 ? (
          <EmptyState tag={tag} />
        ) : (
          <>
            <div className='mb-6'>
              <p className='text-sm text-muted-foreground'>
                {postsData?.pagination.total} post
                {postsData?.pagination.total === 1 ? '' : 's'} tagged with
                &quot;
                {tag}&quot;
              </p>
            </div>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {postsData?.posts.map((post, index) => (
                <ArticleCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
