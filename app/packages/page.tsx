import { Compass, MapPin, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { destinationsSummary } from '@/constants/destinations-summary';

export default function PackagesIndexPage() {
  return (
    <div className='min-h-screen bg-background '>
      {/* Header Section */}
      <section className='relative py-10 overflow-hidden bg-linear-to-bl from-primary/10 to-primary/5'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700'>
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20'>
              <Compass className='w-4 h-4' />
              <span>Tour Destinations</span>
            </div>

            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              Choose Your
              <span className='text-primary'> Destination</span>
            </h1>

            <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
              Explore our handpicked destinations across Bangladesh with
              multiple tour packages for each location
            </p>
          </div>
        </div>
      </section>

      {/* All Destinations */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>All Destinations</h2>
            <p className='text-sm text-muted-foreground'>
              {destinationsSummary.length}{' '}
              {destinationsSummary.length === 1
                ? 'destination'
                : 'destinations'}
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {destinationsSummary.map((dest, idx) => (
              <Link
                key={dest.slug}
                href={`/packages/${dest.slug}`}
                className='group'
              >
                <Card
                  className='overflow-hidden pt-0 border-2 hover:border-primary/50 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col animate-in fade-in duration-700'
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className='relative h-48 overflow-hidden'>
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />

                    <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                      <h3 className='text-lg font-bold mb-1 group-hover:text-primary transition-colors'>
                        {dest.name}
                      </h3>
                      <div className='flex items-center gap-1.5 text-xs text-white/90'>
                        <MapPin className='w-3 h-3' />
                        <span>{dest.region}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className='p-4 space-y-3 flex-1 flex flex-col'>
                    <p className='text-sm text-muted-foreground line-clamp-2 flex-1'>
                      {dest.description}
                    </p>

                    <div className='space-y-2'>
                      <div className='flex flex-wrap gap-1.5'>
                        {dest.highlights.slice(0, 3).map((highlight, i) => (
                          <Badge
                            // biome-ignore lint/suspicious/noArrayIndexKey: valid static rendering
                            key={i}
                            variant='secondary'
                            className='text-xs px-2 py-0.5'
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className='flex items-center justify-between text-sm pt-2 border-t'>
                        <div className='flex items-center gap-1.5'>
                          <Package className='w-4 h-4 text-primary' />
                          <span className='font-medium'>
                            {dest.packageCount}
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <p className='text-xs text-muted-foreground'>From</p>
                          <p className='text-base font-bold text-primary'>
                            ৳{dest.startingPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
