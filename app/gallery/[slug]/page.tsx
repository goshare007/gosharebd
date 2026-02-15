'use client';

import {
  ArrowLeft,
  Calendar,
  Camera,
  Download,
  MapPin,
  Share2,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  // Mock data - replace with actual data fetching based on params.slug
  const galleryData = {
    slug: slug,
    title: "Cox's Bazar Sunset Collection",
    coverImage:
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop',
    location: "Cox's Bazar",
    date: 'December 2025',
    category: 'beaches',
    photographer: 'Ahmed Rahman',
    description:
      'Experience the breathtaking sunsets over the longest natural beach in the world. This collection captures the golden hour magic as the sun dips below the horizon, painting the sky in stunning hues of orange, pink, and purple.',
    images: [
      {
        id: 1,
        src: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=1200&fit=crop',
        title: 'Golden Hour',
        caption: 'The sun sets over the pristine beach',
      },
      {
        id: 2,
        src: 'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=600&fit=crop',
        title: 'Tranquil Waters',
        caption: 'Crystal clear waters at sunset',
      },
      {
        id: 3,
        src: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=1000&fit=crop',
        title: 'Beach Walk',
        caption: 'A peaceful evening stroll along the shore',
      },
      {
        id: 4,
        src: 'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=800&fit=crop',
        title: 'Sky Ablaze',
        caption: 'Vibrant colors fill the evening sky',
      },
      {
        id: 5,
        src: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
        title: 'Reflections',
        caption: 'Sunset reflections on wet sand',
      },
      {
        id: 6,
        src: 'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=1200&fit=crop',
        title: 'Endless Horizon',
        caption: 'Where the sea meets the sky',
      },
      {
        id: 7,
        src: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=800&fit=crop',
        title: 'Twilight',
        caption: 'The last rays of daylight',
      },
      {
        id: 8,
        src: 'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=1000&fit=crop',
        title: 'Beach Silhouettes',
        caption: 'Figures against the sunset backdrop',
      },
      {
        id: 9,
        src: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
        title: 'Ocean Dreams',
        caption: 'Waves gently lapping the shore',
      },
      {
        id: 10,
        src: 'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=1200&fit=crop',
        title: 'Paradise Found',
        caption: 'The beauty of nature on display',
      },
      {
        id: 11,
        src: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=800&fit=crop',
        title: 'Coastal Magic',
        caption: 'The enchanting coastline at dusk',
      },
      {
        id: 12,
        src: 'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=1000&fit=crop',
        title: 'Final Light',
        caption: 'The day comes to a close',
      },
    ],
  };

  return (
    <div className='min-h-screen bg-background mt-16'>
      {/* Hero Section with Cover Image */}
      <section className='relative h-[60vh] md:h-[70vh] overflow-hidden'>
        <Image
          src={galleryData.coverImage}
          alt={galleryData.title}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-b from-background/60 via-background/40 to-background' />

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
                <Badge variant='secondary' className='capitalize'>
                  {galleryData.category}
                </Badge>
                <div className='flex items-center gap-2 text-sm text-white/90'>
                  <Camera className='w-4 h-4' />
                  <span>{galleryData.images.length} Photos</span>
                </div>
              </div>

              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl'>
                {galleryData.title}
              </h1>

              <div className='flex flex-wrap items-center gap-4 text-sm text-white/90'>
                <div className='flex items-center gap-2'>
                  <MapPin className='w-4 h-4' />
                  <span>{galleryData.location}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span>{galleryData.date}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  <span>By {galleryData.photographer}</span>
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
              {galleryData.description}
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
            {galleryData.images.map((image, idx) => (
              <Card
                key={image.id}
                className='break-inside-avoid p-0 overflow-hidden border-2 hover:border-primary/50 transition-all group animate-in fade-in duration-700'
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className='relative overflow-hidden'>
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={800}
                    height={600}
                    className='w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500'
                  />

                  {/* Overlay on hover */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute bottom-0 left-0 right-0 p-4 text-white space-y-1'>
                      <h3 className='font-bold text-base'>{image.title}</h3>
                      <p className='text-xs text-white/90'>{image.caption}</p>
                    </div>
                  </div>
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
