'use client';

import { ArrowRight, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'All',
  'Travel Tips',
  'Destinations',
  'Culture',
  'Nature',
  'Food',
];

const ARTICLES = [
  {
    slug: 'sundarbans-first-time-guide',
    title: 'Your first time in the Sundarbans: everything you need to know',
    excerpt:
      "The world's largest mangrove forest is unlike anywhere else on earth. Here's how to prepare, what to expect, and how to make the most of every hour.",
    category: 'Destinations',
    readTime: '8 min read',
    date: 'February 2026',
    image:
      'https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=80',
    featured: true,
    author: { name: 'Rafi Islam', initials: 'RI' },
  },
  {
    slug: 'bangladesh-best-kept-secrets',
    title: '7 places in Bangladesh most people have never heard of',
    excerpt:
      "Beyond Cox's Bazar and the Sundarbans lies a country full of forgotten temples, hidden waterfalls, and river deltas that will take your breath away.",
    category: 'Destinations',
    readTime: '6 min read',
    date: 'January 2026',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    featured: false,
    author: { name: 'Nadia Hossain', initials: 'NH' },
  },
  {
    slug: 'packing-bangladesh-monsoon',
    title: 'What to pack for a Bangladesh tour in monsoon season',
    excerpt:
      'Monsoon transforms the country into something magical — but it also demands the right gear. Our definitive packing list for wet season travel.',
    category: 'Travel Tips',
    readTime: '5 min read',
    date: 'January 2026',
    image:
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    featured: false,
    author: { name: 'Tasneem Akter', initials: 'TA' },
  },
  {
    slug: 'ratargul-swamp-forest',
    title: "Ratargul: Bangladesh's own floating forest",
    excerpt:
      "Often called the Amazon of Bangladesh, Ratargul swamp forest near Sylhet is one of the country's most surreal natural wonders. Here's how to get there.",
    category: 'Nature',
    readTime: '7 min read',
    date: 'December 2025',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    featured: false,
    author: { name: 'Rafi Islam', initials: 'RI' },
  },
  {
    slug: 'street-food-dhaka-guide',
    title: 'The ultimate guide to street food in Old Dhaka',
    excerpt:
      "Old Dhaka is one of Asia's great food cities — if you know where to look. From Bakarkhani to Biryani, this is where to eat and what to order.",
    category: 'Food',
    readTime: '9 min read',
    date: 'December 2025',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    featured: false,
    author: { name: 'Nadia Hossain', initials: 'NH' },
  },
  {
    slug: 'eid-travel-tips-bangladesh',
    title: 'Travelling during Eid in Bangladesh: tips for a stress-free trip',
    excerpt:
      'Eid is the busiest travel period of the year. Book early, stay flexible, and follow these tips to turn the chaos into an adventure.',
    category: 'Travel Tips',
    readTime: '6 min read',
    date: 'November 2025',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80',
    featured: false,
    author: { name: 'Tasneem Akter', initials: 'TA' },
  },
  {
    slug: 'tribal-culture-chittagong-hill-tracts',
    title: 'Meeting the communities of the Chittagong Hill Tracts',
    excerpt:
      'The hill tracts are home to eleven indigenous communities, each with distinct traditions, art forms, and ways of life. A guide to respectful cultural tourism.',
    category: 'Culture',
    readTime: '10 min read',
    date: 'November 2025',
    image:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
    featured: false,
    author: { name: 'Rafi Islam', initials: 'RI' },
  },
  {
    slug: 'responsible-tourism-bangladesh',
    title: 'How to travel responsibly in Bangladesh',
    excerpt:
      "Tourism can help or harm the places we love. Here's how to make sure your visit leaves a positive mark on communities and ecosystems alike.",
    category: 'Travel Tips',
    readTime: '7 min read',
    date: 'October 2025',
    image:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    featured: false,
    author: { name: 'Nadia Hossain', initials: 'NH' },
  },
];

// ─── Featured article ─────────────────────────────────────────────────────────
function FeaturedArticle({ article }: { article: (typeof ARTICLES)[number] }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className='group grid md:grid-cols-2 gap-0 rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300'
    >
      {/* Image */}
      <div className='relative h-64 md:h-auto overflow-hidden'>
        <Image
          src={article.image}
          alt={article.title}
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

      {/* Content */}
      <div className='p-7 flex flex-col justify-between bg-card'>
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full'>
              {article.category}
            </span>
          </div>
          <h2 className='font-display text-xl sm:text-2xl font-bold leading-snug group-hover:text-primary transition-colors'>
            {article.title}
          </h2>
          <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3'>
            {article.excerpt}
          </p>
        </div>

        <div className='flex items-center justify-between mt-6'>
          <div className='flex items-center gap-2.5'>
            <div className='w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center'>
              <span className='text-xs font-bold text-primary'>
                {article.author.initials}
              </span>
            </div>
            <div>
              <p className='text-xs font-medium'>{article.author.name}</p>
              <p className='text-xs text-muted-foreground'>{article.date}</p>
            </div>
          </div>
          <div className='flex items-center gap-1.5 text-xs text-primary font-medium'>
            <Clock className='w-3 h-3' />
            {article.readTime}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({
  article,
  index,
}: {
  article: (typeof ARTICLES)[number];
  index: number;
}) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className='group flex flex-col rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4'
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className='relative h-48 overflow-hidden'>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/30 to-transparent' />
        <div className='absolute top-3 left-3'>
          <span className='text-xs font-medium bg-background/90 backdrop-blur-sm text-foreground px-2 py-0.5 rounded-full'>
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='p-5 flex flex-col flex-1'>
        <h3 className='text-sm font-semibold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2'>
          {article.title}
        </h3>
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1'>
          {article.excerpt}
        </p>

        <div className='flex items-center justify-between mt-4 pt-4 border-t border-border'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center'>
              <span className='text-[10px] font-bold text-primary'>
                {article.author.initials}
              </span>
            </div>
            <span className='text-xs text-muted-foreground'>
              {article.date}
            </span>
          </div>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Clock className='w-3 h-3' />
            {article.readTime}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const featured = ARTICLES.find((a) => a.featured);
  const rest = ARTICLES.filter((a) => !a.featured);

  const filtered =
    activeCategory === 'All'
      ? rest
      : rest.filter((a) => a.category === activeCategory);

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
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
          {/* Featured */}
          {featured && (
            <div>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-px w-8 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Featured
                </span>
              </div>
              <FeaturedArticle article={featured} />
            </div>
          )}

          {/* Category filter */}
          <div className='flex items-center gap-2 flex-wrap'>
            <Tag className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type='button'
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/70',
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Article grid */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {filtered.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className='rounded-2xl border-2 border-dashed border-border p-10 text-center space-y-4'>
            <div className='space-y-2'>
              <h2 className='font-display text-xl font-bold'>
                Never miss a story
              </h2>
              <p className='text-sm text-muted-foreground'>
                New articles every week. No spam — just good writing about
                Bangladesh travel.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-2 max-w-sm mx-auto'>
              <input
                type='email'
                placeholder='your@email.com'
                className='flex-1 h-10 px-4 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30'
              />
              <button
                type='button'
                className='h-10 px-5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shrink-0'
              >
                Subscribe
                <ArrowRight className='w-3.5 h-3.5' />
              </button>
            </div>
            <p className='text-xs text-muted-foreground'>
              Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
