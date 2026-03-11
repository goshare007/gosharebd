import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Button } from '@/components/ui/button';
import { getArticleBySlug, getArticleSlugs } from '@/lib/help';

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug: slug.replace(/\.md$/, '') }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.meta.title} | GoShareBD Help`,
    description: article.meta.description,
  };
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 {...props} className='font-display text-3xl font-bold mt-8 mb-4' />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 {...props} className='font-display text-2xl font-semibold mt-8 mb-3' />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 {...props} className='text-xl font-semibold mt-6 mb-2' />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className='text-muted-foreground leading-relaxed mb-4' />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className='list-disc list-inside mb-4 space-y-1' />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className='list-decimal list-inside mb-4 space-y-1' />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className='text-muted-foreground' />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className='border-l-4 border-primary pl-4 py-2 my-4 bg-muted/30 rounded-r-lg'
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong {...props} className='font-semibold text-foreground' />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className='text-primary hover:underline' />
  ),
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Link
          href='/help'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
        >
          <ArrowLeft className='w-4 h-4' />
          Back to Help Center
        </Link>

        <article className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <header className='mb-8 pb-6 border-b border-border'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground mb-3'>
              <span className='bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium'>
                {article.meta.category}
              </span>
            </div>
            <h1 className='font-display text-3xl sm:text-4xl font-bold mb-3'>
              {article.meta.title}
            </h1>
            {article.meta.description && (
              <p className='text-muted-foreground text-lg'>
                {article.meta.description}
              </p>
            )}
          </header>

          <div className='prose prose-neutral dark:prose-invert max-w-none'>
            <MDXRemote source={article.content} components={components} />
          </div>
        </article>

        <footer className='mt-12 pt-8 border-t border-border'>
          <div className='bg-muted/30 rounded-xl p-6'>
            <div className='flex items-start gap-4'>
              <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0'>
                <Calendar className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h3 className='font-semibold mb-1'>Still need help?</h3>
                <p className='text-sm text-muted-foreground mb-3'>
                  Our team is available Saturday through Thursday, 9am to 7pm.
                </p>
                <Button asChild size='sm'>
                  <Link href='/contact'>
                    Contact us <ChevronRight className='w-4 h-4 ml-1' />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
