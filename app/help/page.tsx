'use client';

import {
  ArrowRight,
  BookOpen,
  Calendar,
  CreditCard,
  HelpCircle,
  LogIn,
  // biome-ignore lint/suspicious/noShadowRestrictedNames: this is fine
  Map,
  RefreshCw,
  Search,
  Shield,
  Star,
  Ticket,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'getting-started',
    icon: BookOpen,
    label: 'Getting Started',
    color:
      'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    articles: [
      { title: 'How to create an account', slug: 'create-account' },
      { title: 'Signing in with Google', slug: 'google-signin' },
      {
        title: 'Browsing and filtering tour packages',
        slug: 'browsing-packages',
      },
      { title: 'Understanding package inclusions', slug: 'package-inclusions' },
      { title: 'How to read a tour itinerary', slug: 'read-itinerary' },
    ],
  },
  {
    id: 'booking',
    icon: Ticket,
    label: 'Booking',
    color:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    articles: [
      { title: 'How to make a booking', slug: 'make-booking' },
      { title: 'Adding group members', slug: 'adding-members' },
      { title: 'Age categories explained', slug: 'age-categories' },
      { title: 'Booking for children and infants', slug: 'children-infants' },
      { title: 'What happens after I book?', slug: 'after-booking' },
      { title: 'Can I book for someone else?', slug: 'booking-for-others' },
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    label: 'Payments',
    color:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    articles: [
      { title: 'How payment works', slug: 'how-payment-works' },
      { title: 'Accepted payment methods', slug: 'payment-methods' },
      { title: 'How pricing is calculated', slug: 'pricing-calculation' },
      { title: 'Understanding VAT on bookings', slug: 'vat-explained' },
      { title: 'Payment not going through', slug: 'payment-issues' },
    ],
  },
  {
    id: 'cancellations',
    icon: RefreshCw,
    label: 'Cancellations & Refunds',
    color:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900',
    iconBg: 'bg-red-100 dark:bg-red-900/40',
    articles: [
      { title: 'How to cancel a booking', slug: 'cancel-booking' },
      { title: 'Refund policy explained', slug: 'refund-policy' },
      { title: 'Requesting a date change', slug: 'date-change' },
      {
        title: 'What if the tour is cancelled by you?',
        slug: 'tour-cancelled',
      },
      { title: 'Refunds for medical emergencies', slug: 'medical-refund' },
    ],
  },
  {
    id: 'during-tour',
    icon: Map,
    label: 'During the Tour',
    color:
      'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900',
    iconBg: 'bg-teal-100 dark:bg-teal-900/40',
    articles: [
      { title: 'What to bring on your tour', slug: 'what-to-bring' },
      { title: 'Meeting your guide', slug: 'meeting-your-guide' },
      { title: 'What happens if I miss departure?', slug: 'missed-departure' },
      { title: 'Itinerary changes on the day', slug: 'day-of-changes' },
      { title: 'Contacting us during the tour', slug: 'contact-during-tour' },
    ],
  },
  {
    id: 'safety',
    icon: Shield,
    label: 'Safety',
    color:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    articles: [
      { title: 'Our safety standards', slug: 'safety-standards' },
      { title: 'Disclosing medical conditions', slug: 'medical-disclosure' },
      { title: 'Emergency contacts', slug: 'emergency-contacts' },
      { title: 'Reporting a safety concern', slug: 'report-concern' },
    ],
  },
  {
    id: 'account',
    icon: LogIn,
    label: 'Account & Profile',
    color:
      'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-400 dark:border-slate-900',
    iconBg: 'bg-slate-100 dark:bg-slate-900/40',
    articles: [
      { title: 'Updating your profile', slug: 'update-profile' },
      { title: 'Changing your email address', slug: 'change-email' },
      { title: 'Viewing your booking history', slug: 'booking-history' },
      { title: 'Deleting your account', slug: 'delete-account' },
    ],
  },
  {
    id: 'reviews',
    icon: Star,
    label: 'Reviews',
    color:
      'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    articles: [
      { title: 'How to leave a review', slug: 'leave-review' },
      { title: 'Editing or deleting a review', slug: 'edit-review' },
      { title: 'Our review guidelines', slug: 'review-guidelines' },
    ],
  },
];

const POPULAR_ARTICLES = [
  { title: 'How to make a booking', slug: 'make-booking', category: 'Booking' },
  {
    title: 'Age categories explained',
    slug: 'age-categories',
    category: 'Booking',
  },
  {
    title: 'Accepted payment methods',
    slug: 'payment-methods',
    category: 'Payments',
  },
  {
    title: 'Refund policy explained',
    slug: 'refund-policy',
    category: 'Cancellations',
  },
  {
    title: 'What to bring on your tour',
    slug: 'what-to-bring',
    category: 'During the Tour',
  },
  {
    title: 'Disclosing medical conditions',
    slug: 'medical-disclosure',
    category: 'Safety',
  },
];

// ─── Search bar ───────────────────────────────────────────────────────────────
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className='relative max-w-xl mx-auto'>
      <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search help articles…'
        className='pl-10 h-12 rounded-xl text-sm'
      />
    </div>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────
function CategoryCard({
  category,
  searchQuery,
  index,
}: {
  category: (typeof CATEGORIES)[number];
  searchQuery: string;
  index: number;
}) {
  const Icon = category.icon;
  const filtered = searchQuery
    ? category.articles.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : category.articles;

  if (filtered.length === 0) return null;

  return (
    <div
      className='rounded-2xl border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700'
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Category header */}
      <div className='flex items-center gap-3 px-5 py-4 bg-muted/30 border-b border-border'>
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
            category.iconBg,
          )}
        >
          <Icon className='w-4 h-4 text-primary' />
        </div>
        <div>
          <h2 className='text-sm font-semibold'>{category.label}</h2>
          <p className='text-xs text-muted-foreground'>
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className='divide-y divide-border'>
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/help/${article.slug}`}
            className='flex items-center justify-between px-5 py-3.5 hover:bg-primary/2 transition-colors group'
          >
            <span className='text-sm text-muted-foreground group-hover:text-foreground transition-colors'>
              {article.title}
            </span>
            <ArrowRight className='w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0' />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HelpCenterPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleCategories = activeCategory
    ? CATEGORIES.filter((c) => c.id === activeCategory)
    : CATEGORIES;

  const totalResults = search
    ? CATEGORIES.reduce(
        (s, c) =>
          s +
          c.articles.filter((a) =>
            a.title.toLowerCase().includes(search.toLowerCase()),
          ).length,
        0,
      )
    : null;

  return (
    <div className='min-h-screen bg-background'>
      {/* ── Hero with search ─────────────────────────────────────────────── */}
      <section className='relative pt-16 pb-14 bg-primary/5 border-b border-border overflow-hidden'>
        <div className='absolute right-8 top-4 font-display text-[8rem] font-bold text-primary/5 leading-none select-none pointer-events-none hidden lg:block'>
          HELP
        </div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <div className='max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700'>
            <div className='flex items-center justify-center gap-3 mb-4'>
              <div className='h-px w-10 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Help Centre
              </span>
              <div className='h-px w-10 bg-primary' />
            </div>
            <h1 className='font-display text-4xl sm:text-5xl font-bold leading-tight mb-4'>
              How can we{' '}
              <span className='italic font-light text-muted-foreground'>
                help
              </span>
              <span className='text-primary'>?</span>
            </h1>
            <p className='text-muted-foreground text-base leading-relaxed mb-8'>
              Search our help articles or browse by category below.
            </p>
            <SearchBar value={search} onChange={setSearch} />
            {totalResults !== null && (
              <p className='text-xs text-muted-foreground mt-3'>
                {totalResults === 0
                  ? 'No articles found — try different keywords or contact us.'
                  : `${totalResults} article${totalResults !== 1 ? 's' : ''} found`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Popular articles ─────────────────────────────────────────────── */}
      {!search && (
        <section className='py-10 border-b border-border bg-muted/20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-3 mb-5'>
              <div className='h-px w-8 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Popular Articles
              </span>
            </div>
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
              {POPULAR_ARTICLES.map(({ title, slug, category }, i) => (
                <Link
                  key={slug}
                  href={`/help/${slug}`}
                  className='group flex items-start justify-between gap-3 rounded-xl border border-border p-4 hover:border-primary/30 hover:bg-primary/2 transition-all animate-in fade-in slide-in-from-bottom-4'
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div>
                    <p className='text-sm font-medium group-hover:text-primary transition-colors leading-snug'>
                      {title}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {category}
                    </p>
                  </div>
                  <ArrowRight className='w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all' />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Category filter + articles ───────────────────────────────────── */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[200px_1fr] gap-10 lg:gap-14 items-start'>
            {/* Category filter sidebar */}
            {!search && (
              <div className='lg:sticky lg:top-8 space-y-1'>
                <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3 px-3'>
                  Categories
                </p>
                <button
                  type='button'
                  onClick={() => setActiveCategory(null)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    activeCategory === null
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                  )}
                >
                  <HelpCircle className='w-3.5 h-3.5 shrink-0' />
                  All categories
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type='button'
                    onClick={() =>
                      setActiveCategory(
                        cat.id === activeCategory ? null : cat.id,
                      )
                    }
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                      activeCategory === cat.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                    )}
                  >
                    <cat.icon className='w-3.5 h-3.5 shrink-0' />
                    {cat.label}
                  </button>
                ))}

                {/* Contact nudge */}
                <div className='mt-8 pt-6 border-t mx-1 rounded-xl bg-primary/5 border border-primary/15 p-4 space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Users className='w-3.5 h-3.5 text-primary shrink-0' />
                    <p className='text-xs font-semibold text-primary'>
                      Need more help?
                    </p>
                  </div>
                  <p className='text-xs text-muted-foreground leading-relaxed'>
                    Can't find what you're looking for?
                  </p>
                  <Button
                    asChild
                    size='sm'
                    variant='outline'
                    className='w-full text-xs mt-1'
                  >
                    <Link href='/contact'>Contact us</Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Articles grid */}
            <div
              className={cn(
                'grid gap-5',
                search ? 'sm:grid-cols-2' : 'sm:grid-cols-1 lg:grid-cols-2',
              )}
            >
              {visibleCategories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  searchQuery={search}
                  index={i}
                />
              ))}

              {/* No results */}
              {search && totalResults === 0 && (
                <div className='col-span-full rounded-2xl border-2 border-dashed border-border p-12 text-center space-y-4'>
                  <div className='flex justify-center'>
                    <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center'>
                      <Search className='w-5 h-5 text-muted-foreground' />
                    </div>
                  </div>
                  <div className='space-y-1.5'>
                    <p className='font-semibold text-sm'>No articles found</p>
                    <p className='text-xs text-muted-foreground'>
                      Try different keywords, or browse all categories.
                    </p>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-2 justify-center'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setSearch('')}
                    >
                      Clear search
                    </Button>
                    <Button asChild size='sm'>
                      <Link href='/contact'>Contact us</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Still need help CTA ──────────────────────────────────────────── */}
      <section className='py-12 border-t border-border bg-primary/2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-xl mx-auto text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center'>
                <Calendar className='w-5 h-5 text-primary' />
              </div>
            </div>
            <h2 className='font-display text-xl font-bold'>
              Still have questions?
            </h2>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Our team is available Saturday through Thursday, 9am to 7pm. We
              also respond to emails and contact form messages within 24 hours
              every day.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center pt-1'>
              <Button asChild>
                <Link href='/contact'>Contact us</Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/faq'>Browse FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
