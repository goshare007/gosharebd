'use client';
import { ArrowRight, Award, Clock, MapPin, Package, Tag } from 'lucide-react';
import { motion, useInView, type Variants } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePopularPackages } from '@/services/packages';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  }),
};

function PackageCardSkeleton() {
  return (
    <Card className='border-2 pt-0 overflow-hidden bg-background'>
      <Skeleton className='h-56 w-full rounded-none' />
      <CardContent className='p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-9 w-full' />
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className='col-span-full py-16 text-center space-y-4'>
      <div className='flex justify-center'>
        <div className='rounded-full bg-muted p-5'>
          <Package className='w-10 h-10 text-muted-foreground' />
        </div>
      </div>
      <h3 className='text-lg font-medium'>No packages available</h3>
      <p className='text-sm text-muted-foreground max-w-xs mx-auto'>
        Check back soon — new tour packages are being added regularly.
      </p>
    </div>
  );
}

export default function PopularPackages() {
  const { data: packages, isPending, isError } = usePopularPackages();
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section
      id='packages'
      className='py-12 md:py-20 bg-linear-to-br from-secondary/10 to-background relative overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* ── Section header — same pattern as Features ── */}
        <div ref={headerRef} className='mb-14'>
          <motion.div
            variants={fadeUp}
            initial='hidden'
            animate={headerInView ? 'show' : 'hidden'}
            custom={0}
            className='flex items-center gap-3 mb-5'
          >
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Tour Packages
            </span>
          </motion.div>

          <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6'>
            <motion.h2
              variants={fadeUp}
              initial='hidden'
              animate={headerInView ? 'show' : 'hidden'}
              custom={0.1}
              className='text-3xl sm:text-5xl font-bold tracking-tight leading-tight max-w-xl'
            >
              Our most{' '}
              <span className='italic font-light text-muted-foreground'>
                loved
              </span>{' '}
              tours across Bangladesh
              <span className='text-primary'>.</span>
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial='hidden'
              animate={headerInView ? 'show' : 'hidden'}
              custom={0.2}
              className='lg:pb-1'
            >
              <Button
                asChild
                size='sm'
                variant='outline'
                className='gap-2 group/btn'
              >
                <Link href='/packages'>
                  Browse all packages
                  <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform duration-200' />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Packages grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {isPending ? (
            Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              <PackageCardSkeleton key={i} />
            ))
          ) : isError ? null : !packages || packages.length === 0 ? (
            <EmptyState />
          ) : (
            packages.map((pkg, idx) => (
              <Link key={pkg.id} href={`/packages/${pkg.id}`}>
                <Card
                  className='group border-2 pt-0 overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-background animate-in fade-in slide-in-from-bottom'
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Image section */}
                  <div className='relative h-56 overflow-hidden'>
                    {pkg.coverImage ? (
                      <Image
                        src={pkg.coverImage}
                        alt={pkg.name}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-700'
                        priority={idx < 3}
                        sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                      />
                    ) : (
                      <div className='h-full w-full bg-muted flex items-center justify-center'>
                        <Package className='w-12 h-12 text-muted-foreground' />
                      </div>
                    )}
                    <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent' />

                    {/* Top-left: Bestseller OR Duration */}
                    {pkg.isBestseller ? (
                      <div className='absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg'>
                        <Award className='w-3.5 h-3.5' />
                        <span className='text-xs font-bold'>Bestseller</span>
                      </div>
                    ) : (
                      pkg.durationDays && (
                        <div className='absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg'>
                          <Clock className='w-3.5 h-3.5 text-primary' />
                          <span className='text-sm font-bold'>
                            {pkg.durationDays} days
                          </span>
                        </div>
                      )
                    )}

                    {/* Top-right: Duration (only when bestseller badge takes top-left) */}
                    {pkg.isBestseller && pkg.durationDays && (
                      <div className='absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg'>
                        <Clock className='w-3.5 h-3.5 text-primary' />
                        <span className='text-sm font-bold'>
                          {pkg.durationDays} days
                        </span>
                      </div>
                    )}

                    {/* Bottom info on image */}
                    <div className='absolute bottom-4 left-4 right-4'>
                      <h3 className='text-white text-xl font-bold leading-tight'>
                        {pkg.name}
                      </h3>
                      <div className='flex items-center gap-1 mt-1'>
                        <MapPin className='w-3.5 h-3.5 text-white/80' />
                        <p className='text-white/80 text-sm'>{pkg.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card content */}
                  <CardContent className='p-6 space-y-4'>
                    <div className='flex items-end justify-between'>
                      <div className='flex items-center gap-2 text-muted-foreground'>
                        <Tag className='w-4 h-4 text-primary' />
                        <span className='text-sm font-medium'>Per person</span>
                      </div>
                      <div className='text-right'>
                        {pkg.originalPrice && (
                          <p className='text-xs text-muted-foreground line-through'>
                            ৳{Number(pkg.originalPrice).toLocaleString()}
                          </p>
                        )}
                        <p className='text-lg font-bold text-primary'>
                          ৳{Number(pkg.pricePerPerson).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant='outline'
                      className='w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all'
                    >
                      View Package
                      <ArrowRight className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
