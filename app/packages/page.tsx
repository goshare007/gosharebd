import { Compass, MapPin, Package, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function PackagesIndexPage() {
  const destinations = [
    {
      slug: 'coxs-bazar',
      name: "Cox's Bazar",
      image:
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
      region: 'Chittagong Division',
      packageCount: 12,
      couplePackageCount: 5,
      featured: true,
      description: "World's longest natural sea beach with stunning sunsets",
      highlights: ['Beach Resort', 'Sunset Views', 'Water Sports', 'Seafood'],
      startingPrice: 8500,
    },
    {
      slug: 'sundarbans',
      name: 'Sundarbans',
      image:
        'https://images.unsplash.com/photo-1551615577-1c7e180a77ac?w=800&h=600&fit=crop',
      region: 'Khulna Division',
      packageCount: 8,
      couplePackageCount: 3,
      featured: true,
      description:
        "World's largest mangrove forest and Royal Bengal Tiger habitat",
      highlights: [
        'Wildlife Safari',
        'Boat Tours',
        'Bird Watching',
        'Photography',
      ],
      startingPrice: 15000,
    },
    {
      slug: 'sylhet',
      name: 'Sylhet',
      image:
        'https://images.unsplash.com/photo-1667120205301-a2a3a886886e?w=800&h=600&fit=crop',
      region: 'Sylhet Division',
      packageCount: 15,
      couplePackageCount: 6,
      featured: true,
      description: 'Lush tea gardens, waterfalls, and spiritual sites',
      highlights: ['Tea Gardens', 'Waterfalls', 'Lakes', 'Hill Views'],
      startingPrice: 7000,
    },
    {
      slug: 'bandarban',
      name: 'Bandarban',
      image:
        'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&h=600&fit=crop',
      region: 'Chittagong Division',
      packageCount: 10,
      couplePackageCount: 4,
      featured: true,
      description: 'Mountain peaks, tribal culture, and adventure trekking',
      highlights: ['Mountain Trekking', 'Tribal Villages', 'Camping', 'Hiking'],
      startingPrice: 12000,
    },
    {
      slug: 'dhaka',
      name: 'Dhaka',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      region: 'Dhaka Division',
      packageCount: 18,
      couplePackageCount: 7,
      featured: false,
      description: 'Capital city with rich history, culture, and vibrant life',
      highlights: ['Historic Sites', 'Museums', 'Street Food', 'Markets'],
      startingPrice: 3500,
    },
    {
      slug: 'chittagong',
      name: 'Chittagong Hill Tracts',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      region: 'Chittagong Division',
      packageCount: 11,
      couplePackageCount: 5,
      featured: false,
      description: 'Scenic hills, indigenous communities, and natural beauty',
      highlights: ['Hill Stations', 'Waterfalls', 'Tribal Culture', 'Lakes'],
      startingPrice: 10000,
    },
    {
      slug: 'kuakata',
      name: 'Kuakata',
      image:
        'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=600&fit=crop',
      region: 'Barisal Division',
      packageCount: 7,
      couplePackageCount: 4,
      featured: false,
      description: 'Panoramic sea beach - see both sunrise and sunset',
      highlights: ['Sunrise & Sunset', 'Beach', 'Buddhist Temple', 'Fishing'],
      startingPrice: 8000,
    },
    {
      slug: 'rangamati',
      name: 'Rangamati',
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      region: 'Chittagong Division',
      packageCount: 9,
      couplePackageCount: 3,
      featured: false,
      description: 'Beautiful lake district with islands and hanging bridge',
      highlights: ['Lake Cruise', 'Hanging Bridge', 'Islands', 'Tribal Life'],
      startingPrice: 9500,
    },
  ];

  const featuredDestinations = destinations.filter((dest) => dest.featured);

  return (
    <div className='min-h-screen bg-background'>
      {/* Header Section */}
      <section className='relative py-20 md:py-28 overflow-hidden bg-linear-to-br from-secondary/20 to-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-700'>
            <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20'>
              <Compass className='w-4 h-4' />
              <span>Tour Destinations</span>
            </div>

            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight'>
              Choose Your
              <span className='block text-primary mt-2'>Destination</span>
            </h1>

            <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
              Explore our handpicked destinations across Bangladesh with
              multiple tour packages for each location
            </p>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className='py-12 bg-secondary/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-2 mb-6'>
            <TrendingUp className='w-5 h-5 text-primary' />
            <h2 className='text-2xl font-bold'>Featured Destinations</h2>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredDestinations.map((dest, idx) => (
              <Link
                key={dest.slug}
                href={`/packages/${dest.slug}`}
                className='group'
              >
                <Card
                  className='overflow-hidden pt-0 border-2 border-primary/20 hover:border-primary/50 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col animate-in fade-in duration-700'
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className='relative h-56 overflow-hidden'>
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />

                    <Badge className='absolute top-3 left-3 bg-primary/90 backdrop-blur-sm'>
                      Featured
                    </Badge>

                    <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                      <h3 className='text-xl font-bold mb-1 group-hover:text-primary transition-colors'>
                        {dest.name}
                      </h3>
                      <div className='flex items-center gap-1.5 text-xs text-white/90'>
                        <MapPin className='w-3.5 h-3.5' />
                        <span>{dest.region}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className='p-4 space-y-3 flex-1 flex flex-col'>
                    <p className='text-sm text-muted-foreground line-clamp-2 flex-1'>
                      {dest.description}
                    </p>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center gap-1.5'>
                          <Package className='w-4 h-4 text-primary' />
                          <span className='font-medium'>
                            {dest.packageCount} Tours
                          </span>
                        </div>
                        {dest.couplePackageCount > 0 && (
                          <Badge
                            variant='secondary'
                            className='text-xs bg-pink-500/10 text-pink-700 dark:text-pink-400'
                          >
                            ❤️ {dest.couplePackageCount} Couple
                          </Badge>
                        )}
                      </div>

                      <div className='pt-2 border-t'>
                        <p className='text-xs text-muted-foreground'>
                          Starting from
                        </p>
                        <p className='text-lg font-bold text-primary'>
                          ৳{dest.startingPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Destinations */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>All Destinations</h2>
            <p className='text-sm text-muted-foreground'>
              {destinations.length}{' '}
              {destinations.length === 1 ? 'destination' : 'destinations'}
            </p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {destinations.map((dest, idx) => (
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

                    {dest.featured && (
                      <Badge className='absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-xs'>
                        Featured
                      </Badge>
                    )}

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
                        {dest.couplePackageCount > 0 && (
                          <span className='text-xs text-pink-600 dark:text-pink-400'>
                            ❤️ {dest.couplePackageCount} Couple
                          </span>
                        )}
                      </div>

                      <div>
                        <p className='text-xs text-muted-foreground'>From</p>
                        <p className='text-base font-bold text-primary'>
                          ৳{dest.startingPrice.toLocaleString()}
                        </p>
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
