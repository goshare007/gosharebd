'use client';

import { format } from 'date-fns';
import { Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  type BlogPost,
  useBlogCategories,
  usePublicBlogPosts,
} from '@/services/blog';

function FeaturedArticle({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className='group grid md:grid-cols-2 gap-0 rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300'
    >
      <div className='relative h-64 md:h-auto overflow-hidden'>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-r from-black/10 to-transparent' />
        <div className='absolute top-4 left-4'>
          <span className='text-xs font-semibold bg-primary text-primary-foreground px-2.5 py-1 rounded-full'>
            Featured
          </span>
        </div>
      </div>

      <div className='p-7 flex flex-col justify-between bg-card'>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full'>
              {post.category?.name}
            </span>
          </div>
          <h2 className='font-display text-xl sm:text-2xl font-bold leading-snug group-hover:text-primary transition-colors'>
            {post.title}
          </h2>
          <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3'>
            {post.excerpt}
          </p>
        </div>

        <div className='flex items-center justify-between mt-6'>
          <div className='flex items-center gap-2.5'>
            <div className='w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden'>
              {post.author?.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || ''}
                  width={28}
                  height={28}
                  className='object-cover'
                />
              ) : (
                <span className='text-xs font-bold text-primary'>
                  {post.author?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div>
              <p className='text-xs font-medium'>{post.author?.name}</p>
              <p className='text-xs text-muted-foreground'>
                {post.publishedAt
                  ? format(new Date(post.publishedAt), 'MMMM yyyy')
                  : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

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
          <span className='text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded-full'>
            {post.category?.name}
          </span>
        </div>
      </div>

      <div className='p-5 flex flex-col flex-1'>
        <h3 className='text-sm font-semibold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2'>
          {post.title}
        </h3>
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1'>
          {post.excerpt}
        </p>

        <div className='flex items-center justify-between mt-4 pt-4 border-t border-border'>
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
                <span className='text-[10px] font-bold text-primary'>
                  {post.author?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <span className='text-xs text-muted-foreground'>
              {post.publishedAt
                ? format(new Date(post.publishedAt), 'MMMM yyyy')
                : ''}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
      {[...Array(6)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
        <div key={i} className='rounded-2xl border bg-card overflow-hidden'>
          <Skeleton className='h-48 w-full rounded-none' />
          <div className='p-5 space-y-3'>
            <Skeleton className='h-5 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-1/2' />
            <div className='flex justify-between pt-3'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-20' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category') || undefined;
  const tagName = searchParams.get('tag') || undefined;

  const { data: categories } = useBlogCategories();
  const { data: result, isPending } = usePublicBlogPosts({
    page: 1,
    limit: 20,
    category: categorySlug,
    tag: tagName,
  });

  const posts = result?.posts || [];
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  const categoryList = ['All', ...(categories?.map((c) => c.name) || [])];

  return (
    <div className='min-h-screen bg-background'>
      <section className='relative pt-16 pb-12 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[8rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          BLOG
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Journal
              </span>
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              Stories from the{' '}
              <span className='italic font-light text-muted-foreground'>
                road
              </span>
              <span className='text-primary'>.</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed'>
              Travel guides, destination deep-dives, cultural insights, and
              practical tips for exploring Bangladesh — written by people who
              love it as much as you do.
            </p>
          </div>
        </div>
      </section>

      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
          {featured && !categorySlug && !tagName && (
            <div>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-px w-8 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Featured
                </span>
              </div>
              <FeaturedArticle post={featured} />
            </div>
          )}

          <div className='flex items-center gap-2 flex-wrap'>
            <Tag className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
            {categoryList.map((cat) => (
              <Link
                key={cat}
                href={
                  cat === 'All'
                    ? '/blog'
                    : `/blog?category=${cat.toLowerCase().replace(' ', '-')}`
                }
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full font-medium transition-colors',
                  cat === 'All'
                    ? !categorySlug && !tagName
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70',
                )}
              >
                {cat}
              </Link>
            ))}
          </div>

          {isPending ? (
            <LoadingSkeleton />
          ) : rest.length === 0 ? (
            <div className='text-center py-12 text-muted-foreground'>
              No posts found
            </div>
          ) : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {rest.map((post, i) => (
                <ArticleCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
