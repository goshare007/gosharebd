import { MapPin, Package, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { destinationsSummary } from '@/constants/destinations-summary';

export default function page() {
  return (
    <div>
      <section className=''>
        <div className=' mx-auto '>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl md:text-2xl font-bold'>
              All Destinations{' '}
              <span className='text-xl font-medium'>
                ({destinationsSummary.length})
              </span>
            </h2>
            <Link href={'/dashboard/admin/destinations/new'}>
              <Button>
                <Plus className='w-4 h-4 mr-2' />
                Add New Destination
              </Button>
            </Link>
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
