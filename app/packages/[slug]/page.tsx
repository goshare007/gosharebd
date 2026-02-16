import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  ArrowLeft,
  Clock,
  Info,
  MapPin,
  Package,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

// This would normally come from your database or API based on params.slug
export default function DestinationPackagesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  // Mock destination data - replace with actual data fetching
  const DestinationData = {
    slug: slug,
    name: 'Dhaka',
    coverImage:
      'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1920&h=800&fit=crop',
    region: 'Dhaka Division',
    description:
      'Experience the vibrant capital city of Bangladesh. Discover centuries of history, explore bustling markets, savor authentic street food, and immerse yourself in the rich cultural heritage of Dhaka.',
    highlights: [
      'Historic Monuments',
      'Local Markets',
      'Street Food Tours',
      'Cultural Sites',
      'River Cruise',
      'Museum Visits',
    ],
    totalPackages: 18,
    couplePackages: 7,
  };

  const packages = [
    {
      id: 1,
      slug: 'dhaka-heritage-walk',
      title: 'Dhaka Heritage & Culture Walk',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      duration: '1 Day',
      groupSize: '15-25 people',
      price: 4500,
      originalPrice: 5500,
      couplePrice: null,
      rating: 4.5,
      reviews: 203,
      isCouple: false,
      isBestseller: true,
      description:
        'Discover the rich history and vibrant culture of Old Dhaka with expert guides',
      highlights: [
        'Lalbagh Fort',
        'Ahsan Manzil',
        'Street Food',
        'Rickshaw Ride',
      ],
    },
    {
      id: 2,
      slug: 'dhaka-romantic-evening',
      title: 'Dhaka Romantic Evening Tour',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      duration: '1 Day',
      groupSize: 'Private (2 people)',
      price: 3500,
      originalPrice: 4500,
      couplePrice: 6500,
      rating: 4.8,
      reviews: 87,
      isCouple: true,
      isBestseller: false,
      description:
        'A romantic evening exploring Dhaka with dinner cruise on the Buriganga River',
      highlights: [
        'River Cruise',
        'Sunset Views',
        'Romantic Dinner',
        'Photography',
      ],
    },
    {
      id: 3,
      slug: 'dhaka-food-tour',
      title: 'Dhaka Street Food Adventure',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      duration: '1 Day',
      groupSize: '10-15 people',
      price: 3000,
      originalPrice: 3800,
      couplePrice: 5500,
      rating: 4.9,
      reviews: 156,
      isCouple: true,
      isBestseller: true,
      description:
        'Taste the authentic flavors of Dhaka with a guided street food tour',
      highlights: ['Biryani', 'Fuchka', 'Local Sweets', 'Tea Stalls'],
    },
    {
      id: 4,
      slug: 'dhaka-museum-tour',
      title: 'Dhaka Museum & Art Tour',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      duration: '1 Day',
      groupSize: '12-20 people',
      price: 3800,
      originalPrice: 4500,
      couplePrice: null,
      rating: 4.6,
      reviews: 92,
      isCouple: false,
      isBestseller: false,
      description: "Explore Dhaka's museums and contemporary art galleries",
      highlights: [
        'National Museum',
        'Liberation War Museum',
        'Art Galleries',
        'History',
      ],
    },
    {
      id: 5,
      slug: 'dhaka-weekend-getaway',
      title: 'Dhaka Weekend Getaway',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      duration: '2 Days 1 Night',
      groupSize: '8-12 people',
      price: 8500,
      originalPrice: 10000,
      couplePrice: 15500,
      rating: 4.7,
      reviews: 64,
      isCouple: true,
      isBestseller: false,
      description:
        'A complete Dhaka experience with accommodation and guided tours',
      highlights: ['City Tour', 'Hotel Stay', 'Multiple Meals', 'Shopping'],
    },
    {
      id: 6,
      slug: 'dhaka-photography-walk',
      title: 'Dhaka Photography Walk',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      duration: '1 Day',
      groupSize: '8-12 people',
      price: 4200,
      originalPrice: 5000,
      couplePrice: 7500,
      rating: 4.8,
      reviews: 78,
      isCouple: true,
      isBestseller: false,
      description:
        'Capture the essence of Dhaka with a professional photographer guide',
      highlights: [
        'Photo Spots',
        'Golden Hour',
        'Street Photography',
        'Editing Tips',
      ],
    },
  ];

  return (
    <div className='min-h-screen mt-16'>
      {/* Hero Section with Destination Cover */}
      <section className='relative h-[50vh] md:h-[60vh] overflow-hidden'>
        <Image
          src={DestinationData.coverImage}
          alt={DestinationData.name}
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
            <Link href='/packages'>
              <ArrowLeft className='w-4 h-4' />
              All Destinations
            </Link>
          </Button>
        </div>

        {/* Destination Info */}
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12'>
          <div className='max-w-7xl mx-auto'>
            <div className='space-y-4 animate-in fade-in slide-in-from-bottom duration-700'>
              <div className='flex flex-wrap items-center gap-3'>
                <Badge variant='secondary' className='text-sm'>
                  <MapPin className='w-3.5 h-3.5 mr-1' />
                  {DestinationData.region}
                </Badge>
                <Badge variant='secondary' className='text-sm'>
                  <Package className='w-3.5 h-3.5 mr-1' />
                  {DestinationData.totalPackages} Tours Available
                </Badge>
              </div>

              <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight'>
                {DestinationData.name}
              </h1>

              <p className='text-base md:text-lg text-white/90 max-w-3xl'>
                {DestinationData.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className='border-b border-border bg-secondary/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex flex-wrap gap-2'>
            {DestinationData.highlights.map((highlight, idx) => (
              <Badge
                // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                key={idx}
                variant='secondary'
                className='text-sm px-3 py-1.5'
              >
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <section className='py-4 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-sm font-medium text-muted-foreground'>
            Showing all {packages.length} available tours in{' '}
            {DestinationData.name}
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className='py-12 md:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
            {packages.map((pkg, idx) => (
              <Link
                key={pkg.id}
                href={`/packages/${DestinationData.slug}/${pkg.slug}`}
                className='group'
              >
                <Card
                  className='overflow-hidden pt-0 border-2 hover:border-primary/50 hover:shadow-xl transition-all hover:-translate-y-1 h-full flex flex-col animate-in fade-in duration-700'
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className='relative h-48 overflow-hidden'>
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />

                    {/* Badges */}
                    <div className='absolute top-3 left-3 flex gap-2'>
                      {pkg.isBestseller && (
                        <Badge className='bg-primary/90 backdrop-blur-sm text-xs'>
                          <TrendingUp className='w-3 h-3 mr-1' />
                          Bestseller
                        </Badge>
                      )}
                    </div>
                  </div>

                  <CardContent className='p-5 space-y-3 flex-1 flex flex-col'>
                    <div className='flex-1'>
                      <h3 className='font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
                        {pkg.title}
                      </h3>
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {pkg.description}
                      </p>
                    </div>

                    <div className='space-y-3'>
                      <div className='flex flex-wrap gap-1.5'>
                        {pkg.highlights.slice(0, 3).map((highlight, i) => (
                          <Badge
                            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                            key={i}
                            variant='secondary'
                            className='text-xs px-2 py-0.5'
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4 text-primary' />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-4 h-4 text-primary' />
                          <span className='text-xs'>
                            {pkg.groupSize.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                        <span className='font-semibold text-sm'>
                          {pkg.rating}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          ({pkg.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className='p-5 pt-0'>
                    <div className='w-full'>
                      {pkg.isCouple && pkg.couplePrice ? (
                        <div className='space-y-2'>
                          <div>
                            <p className='text-xs text-muted-foreground mb-1'>
                              Per Person
                            </p>
                            <div className='flex items-baseline gap-2'>
                              <span className='text-xl font-bold text-primary'>
                                ৳{pkg.price.toLocaleString()}
                              </span>
                              <span className='text-xs text-muted-foreground line-through'>
                                ৳{pkg.originalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className='pt-2 border-t'>
                            <p className='text-xs text-muted-foreground mb-1'>
                              For Couple
                            </p>
                            <span className='text-lg font-bold text-pink-600 dark:text-pink-400'>
                              ৳{pkg.couplePrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className='flex items-baseline gap-2 mb-1'>
                            <span className='text-2xl font-bold text-primary'>
                              ৳{pkg.price.toLocaleString()}
                            </span>
                            <span className='text-sm text-muted-foreground line-through'>
                              ৳{pkg.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            per person
                          </p>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className='py-12 bg-secondary/10 border-t border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-start gap-3 max-w-3xl'>
            <Info className='w-5 h-5 text-primary shrink-0 mt-0.5' />
            <div>
              <h3 className='font-semibold mb-2'>
                About {DestinationData.name} Tours
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                All tours include professional guides, entrance fees to
                attractions, and are operated by verified tour operators. Couple
                packages offer special romantic experiences and private
                arrangements. Book with confidence with our best price guarantee
                and flexible cancellation policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
