'use client';

import { Image as ImageIcon, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useGalleryImages } from '@/services/gallery';

export default function GalleryIndexPage() {
  const { isPending, data, error } = useGalleryImages();
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
        <p className='text-lg text-muted-foreground'>Error</p>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-background'>
      {/* Header Section */}
      <section className='relative pt-16 pb-12 bg-primary/5 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
          <div className='max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700'>
            {/* Eyebrow */}
            <div className='flex items-center gap-3 mb-6'>
              <div className='h-px w-12 bg-primary' />
              <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                Explore Bangladesh
              </span>
            </div>

            <h1 className='text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-6'>
              Visual
              <br />
              <span className=' font-light italic text-muted-foreground'>
                Stories
              </span>
              <span className='text-primary'>.</span>
            </h1>

            <p className='text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed'>
              A collection of moments captured across the green delta — rivers,
              forests, and faces of Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
            {data.map((gallery) => (
              <Link
                key={gallery.packageId}
                href={`/gallery/${gallery.packageId}`}
                className='group block break-inside-avoid mb-4'
              >
                <Card className='relative overflow-hidden p-0 border-none rounded-xl bg-muted'>
                  <Image
                    src={gallery.thumbnail.url}
                    alt={gallery.packageName}
                    width={800}
                    height={1200} // Set a large height; object-cover will handle the crop naturally
                    className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500'
                  />

                  {/* Overlay Info */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5'>
                    <h3 className='text-white font-bold text-xl'>
                      {gallery.packageName}
                    </h3>
                    <div className='flex items-center gap-2 text-white/80 text-sm mt-1'>
                      <MapPin className='w-3 h-3' />
                      <span>{gallery.Location}</span>
                    </div>
                  </div>

                  {/* Image Count Badge */}
                  <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-black'>
                    <ImageIcon className='w-3 h-3' />
                    {gallery.imageCount}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
