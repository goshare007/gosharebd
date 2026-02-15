'use client';

import { Camera, Image as ImageIcon, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { GalleriesData } from '@/constants/galleries';

export default function GalleryIndexPage() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header Section */}
      <section className='relative py-20 overflow-hidden bg-linear-to-br from-secondary/20 to-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='text-center space-y-6'>
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20'>
              <Camera className='w-4 h-4' />
              <span>Explore Bangladesh</span>
            </div>

            <h1 className='text-5xl md:text-7xl font-bold tracking-tight'>
              Visual <span className='text-primary'>Stories</span>
            </h1>

            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              A collection of moments captured across the green delta.
            </p>
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* CSS Columns: The "magic" for Masonry. 
              The space-y-4 and break-inside-avoid ensure items don't split across columns.
          */}
          <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4'>
            {GalleriesData.map((gallery) => (
              <Link
                key={gallery.slug}
                href={`/gallery/${gallery.slug}`}
                className='group block break-inside-avoid mb-4'
              >
                <Card className='relative overflow-hidden p-0 border-none rounded-xl bg-muted'>
                  <Image
                    src={gallery.coverImage}
                    alt={gallery.title}
                    width={800}
                    height={1200} // Set a large height; object-cover will handle the crop naturally
                    className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500'
                  />

                  {/* Overlay Info */}
                  <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5'>
                    <h3 className='text-white font-bold text-xl'>
                      {gallery.title}
                    </h3>
                    <div className='flex items-center gap-2 text-white/80 text-sm mt-1'>
                      <MapPin className='w-3 h-3' />
                      <span>{gallery.location}</span>
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
