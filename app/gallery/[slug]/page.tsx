'use client';

import { formatDate } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Camera,
  Download,
  MapPin,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSinglePackageImages } from '@/services/gallery';

export default function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { isPending, data, error } = useSinglePackageImages(slug);

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-muted-foreground'>Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-lg text-destructive'>Failed to load gallery.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section with Cover Image */}
      <section className='relative h-[60vh] md:h-[70vh] overflow-hidden'>
        <Image
          src={data.images[0].url}
          alt={data.package.name}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black' />

        {/* Back Button */}
        <div className='absolute top-6 left-4 sm:left-6 lg:left-8 z-10'>
          <Button
            variant='outline'
            size='sm'
            asChild
            className='gap-2 bg-background/80 backdrop-blur-sm'
          >
            <Link href='/gallery'>
              <ArrowLeft className='w-4 h-4' />
              Back to Galleries
            </Link>
          </Button>
        </div>

        {/* Title Overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12'>
          <div className='max-w-7xl mx-auto'>
            <div className='space-y-4 animate-in fade-in slide-in-from-bottom duration-700'>
              <div className='flex flex-wrap items-center gap-3'>
                <div className='flex items-center gap-2'>
                  {data.package.tags.length > 0 &&
                    data.package.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='capitalize'
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>

              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl'>
                {data.package.name}
              </h1>

              <div className='flex flex-wrap items-center gap-4 text-sm text-white/90'>
                <div className='flex items-center gap-2'>
                  <MapPin className='w-4 h-4' />
                  {data.package.Location}
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  {formatDate(
                    new Date(data.images[0].createdAt),
                    'MMMM d, yyyy',
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <div className='flex items-center gap-2 text-sm text-white/90'>
                    <Camera className='w-4 h-4' />
                    {data.total} {data.total === 1 ? 'Photo' : 'Photos'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className='py-12 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl'>
            <p className='text-lg text-muted-foreground leading-relaxed'>
              {data.package.summary}
            </p>

            <div className='flex items-center gap-3 mt-6'>
              <Button variant='outline' size='sm' className='gap-2'>
                <Share2 className='w-4 h-4' />
                Share Gallery
              </Button>
              <Button variant='outline' size='sm' className='gap-2'>
                <Download className='w-4 h-4' />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
            {data.images.map((image, idx) => (
              <Card
                key={image.id}
                className='break-inside-avoid p-0 overflow-hidden border-2 hover:border-primary/50 transition-all group animate-in fade-in duration-700'
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className='relative overflow-hidden'>
                  <Image
                    src={image.url}
                    alt={`${data.package.name} - Photo ${idx + 1}`}
                    width={800}
                    height={600}
                    className='w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Related Galleries CTA */}
      <section className='py-12 md:py-16 bg-secondary/20 border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            Explore More Galleries
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Discover more stunning photo collections from across Bangladesh
          </p>
          <Button size='lg' asChild>
            <Link href='/gallery'>View All Galleries</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
