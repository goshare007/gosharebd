'use client';

import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Shield,
  Star,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSinglePackages } from '@/services/packages';

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; pac: string }>;
}) {
  const { pac } = use(params);

  const [showCouple, setShowCouple] = useState(false);

  const { isPending, data: packageData, isError } = useSinglePackages(pac);

  if (isPending) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-lg text-muted-foreground'>Loading packages...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-lg text-destructive'>
          Failed to load package details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Image - Clean & Simple */}
      <section className='relative h-[50vh] md:h-[60vh]'>
        <Image
          src={packageData.coverImage}
          alt={packageData.name}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60' />

        {/* Top Action Buttons */}
        <div className='absolute top-6 left-4 sm:left-6 lg:left-8 z-10'>
          <Button
            variant='outline'
            size='sm'
            asChild
            className='gap-2 bg-background/90 backdrop-blur-sm border-2 hover:bg-background'
          >
            <Link href={`/packages/${packageData.destinationId}`}>
              <ArrowLeft className='w-4 h-4' />
              Back
            </Link>
          </Button>
        </div>

        <div className='absolute top-6 right-4 sm:right-6 lg:right-8 z-10 flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='bg-background/90 backdrop-blur-sm border-2 hover:bg-background'
          >
            <Share2 className='w-4 h-4' />
          </Button>
        </div>

        {/* Hero Content */}
        <div className='absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12'>
          <div className='max-w-7xl mx-auto'>
            <div className='flex flex-wrap gap-2 mb-4'>
              {packageData.isCouple && (
                <Badge className='bg-pink-500/90 backdrop-blur-sm border-0'>
                  ❤️ Perfect for Couples
                </Badge>
              )}
              {packageData.isBestseller && (
                <Badge className='bg-primary/90 backdrop-blur-sm border-0'>
                  <Award className='w-3 h-3 mr-1' />
                  Bestseller
                </Badge>
              )}
            </div>

            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4'>
              {packageData.name}
            </h1>

            <div className='flex flex-wrap items-center gap-4 text-white/90'>
              <div className='flex items-center gap-2'>
                <MapPin className='w-5 h-5' />
                <span className='font-medium'>{packageData.Location}</span>
              </div>

              <Separator orientation='vertical' className='h-6 bg-white/30' />
              <div className='flex items-center gap-2'>
                <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                <span className='font-semibold text-sm'>
                  {packageData.averageRating
                    ? packageData.averageRating.toFixed(1)
                    : 'No ratings'}
                </span>
                <span className='text-xs text-muted-foreground'>
                  ({packageData.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-10'>
            {/* Quick Info Bar */}
            <div className='grid grid-cols-3 gap-4 p-6 bg-secondary/20 rounded-xl border-2'>
              <div className='text-center'>
                <Clock className='w-6 h-6 text-primary mx-auto mb-2' />
                <div className='text-sm text-muted-foreground'>Duration</div>
                <div className='font-semibold'>{packageData.durationDays}</div>
              </div>
              <div className='text-center'>
                <Users className='w-6 h-6 text-primary mx-auto mb-2' />
                <div className='text-sm text-muted-foreground'>Group Size</div>
                <div className='font-semibold'>
                  {packageData.minGroupSize} - {packageData.maxGroupSize}
                </div>
              </div>
              <div className='text-center'>
                <MapPin className='w-6 h-6 text-primary mx-auto mb-2' />
                <div className='text-sm text-muted-foreground'>Location</div>
                <div className='font-semibold'>{packageData.Location}</div>
              </div>
            </div>

            {/* About Section */}
            <section>
              <h2 className='text-2xl font-bold mb-4'>About This Tour</h2>
              <p className='text-muted-foreground leading-relaxed text-base'>
                {packageData.summary}
              </p>
            </section>

            {/* Highlights */}
            <section className='bg-primary/5 border-2 border-primary/10 rounded-xl p-6'>
              <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
                <Star className='w-6 h-6 text-primary' />
                Tour Highlights
              </h2>
              <div className='grid sm:grid-cols-2 gap-4'>
                {packageData.highlights.map((highlight, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  <div key={idx} className='flex items-start gap-3'>
                    <CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                    <span className='leading-relaxed'>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Image Section After Highlights */}
            <section className='grid sm:grid-cols-2 gap-4'>
              {/* {packageData.images.slice(1, 3).map((img, idx) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  key={idx}
                  className='relative h-64 rounded-xl overflow-hidden group cursor-pointer'
                >
                  <Image
                    src={img}
                    alt={`${packageData.title} ${idx + 2}`}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                </div>
              ))} */}
            </section>

            {/* Itinerary */}
            <section>
              <h2 className='text-2xl font-bold mb-6'>Detailed Itinerary</h2>
              <div className='space-y-6'>
                {packageData.itinerary.map((item, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  <div key={idx} className='flex gap-4'>
                    <div className='flex flex-col items-center'>
                      <div className='w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0'>
                        <span className='font-bold text-primary text-lg'>
                          {idx + 1}
                        </span>
                      </div>
                      {idx < packageData.itinerary.length - 1 && (
                        <div className='w-0.5 flex-1 bg-border mt-2' />
                      )}
                    </div>
                    <div className='flex-1 pb-6'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 mb-2'>
                        <Badge variant='outline'>
                          <Clock className='w-3 h-3 mr-1' />
                          {item.time}
                        </Badge>
                        <h3 className='font-semibold text-lg'>{item.title}</h3>
                      </div>
                      <p className='text-muted-foreground leading-relaxed'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What's Included/Not Included */}
            <section className='grid md:grid-cols-2 gap-6'>
              <Card className='border-2'>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-400'>
                    <CheckCircle2 className='w-5 h-5' />
                    What's Included
                  </h3>
                  <div className='space-y-3'>
                    {packageData.includes.map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      <div key={idx} className='flex items-start gap-2'>
                        <CheckCircle2 className='w-5 h-5 text-green-500 shrink-0 mt-0.5' />
                        <span className='text-sm'>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className='border-2'>
                <CardContent className='p-6'>
                  <h3 className='text-lg font-bold mb-4 flex items-center gap-2 text-red-700 dark:text-red-400'>
                    <X className='w-5 h-5' />
                    What's Not Included
                  </h3>
                  <div className='space-y-3'>
                    {packageData.excludes.map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      <div key={idx} className='flex items-start gap-2'>
                        <X className='w-5 h-5 text-red-500 shrink-0 mt-0.5' />
                        <span className='text-sm'>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Important Information */}
            <Card className='bg-secondary/30 border-2'>
              <CardContent className='p-6'>
                <h2 className='text-2xl font-bold mb-6 flex items-center gap-2'>
                  <Shield className='w-6 h-6 text-primary' />
                  Important Information
                </h2>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-semibold mb-2'>Cancellation Policy</h4>
                    <p className='text-sm text-muted-foreground'>
                      {packageData.cancellationPolicy}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className='font-semibold mb-2'>Weather Policy</h4>
                    <p className='text-sm text-muted-foreground'>
                      {packageData.weatherPolicy}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className='font-semibold mb-2'>Age Restriction</h4>
                    <p className='text-sm text-muted-foreground'>
                      {packageData.ageRestriction}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery Section */}
            <section>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold'>Photo Gallery</h2>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {/* {packageData.images.map((img, idx) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                    key={idx}
                    className='relative h-48 rounded-lg overflow-hidden cursor-pointer group'
                  >
                    <Image
                      src={img}
                      alt={`${packageData.title} ${idx + 1}`}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors' />
                  </div>
                ))} */}
              </div>
            </section>
          </div>

          <div className='lg:col-span-1'>
            <Card className='sticky top-24 pt-0 border-2 shadow-lg'>
              <CardContent className='p-0'>
                {/* Pricing Header */}
                <div className='bg-linear-to-br from-primary/10 to-primary/5 p-6 border-b-2'>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      {showCouple ? 'Total for Couple' : 'Price per Person'}
                    </h3>
                    {packageData.isCouple && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-xs h-auto p-1 hover:bg-primary/10'
                        onClick={() => setShowCouple(!showCouple)}
                      >
                        {showCouple ? 'See Per person' : 'See Couple price'}
                      </Button>
                    )}
                  </div>
                  <div className='flex items-baseline gap-3'>
                    <span className='text-4xl font-bold text-primary'>
                      ৳
                      {showCouple
                        ? (packageData.couplePrice || 0).toLocaleString()
                        : (packageData.pricePerPerson || 0).toLocaleString()}
                    </span>
                    <span className='text-xl text-muted-foreground line-through'>
                      ৳
                      {showCouple
                        ? (
                            packageData.originalCouplePrice || 0
                          ).toLocaleString()
                        : (packageData.originalPrice || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className='mt-3 inline-flex items-center gap-2 bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium'>
                    <Badge
                      variant='secondary'
                      className='bg-green-500 text-white px-2 py-0'
                    >
                      SAVE
                    </Badge>
                    <span>
                      ৳
                      {(showCouple
                        ? (packageData.originalCouplePrice || 0) -
                          (packageData.couplePrice || 0)
                        : (packageData.originalPrice || 0) -
                          (packageData.pricePerPerson || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className='p-6 space-y-5'>
                  {/* Trust Badges */}
                  <div className='space-y-2.5 pt-2'>
                    <div className='flex items-center gap-3 text-sm'>
                      <div className='w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0'>
                        <Shield className='w-4 h-4 text-green-600' />
                      </div>
                      <span className='text-muted-foreground'>
                        Free cancellation up to 24 hours
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-sm'>
                      <div className='w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0'>
                        <CheckCircle2 className='w-4 h-4 text-blue-600' />
                      </div>
                      <span className='text-muted-foreground'>
                        Instant booking confirmation
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-sm'>
                      <div className='w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0'>
                        <Award className='w-4 h-4 text-purple-600' />
                      </div>
                      <span className='text-muted-foreground'>
                        Best price guarantee
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    className='w-full h-12 text-base font-semibold'
                    size='lg'
                    asChild
                  >
                    <Link href={`/book/${packageData.id}`}>
                      Continue Booking
                    </Link>
                  </Button>

                  {/* Contact Section */}
                  <div className='space-y-3 bg-secondary/20 p-4 rounded-lg'>
                    <h4 className='font-semibold text-sm flex items-center gap-2'>
                      <MessageCircle className='w-4 h-4 text-primary' />
                      Need Help Booking?
                    </h4>
                    <div className='space-y-2'>
                      <a
                        href='tel:+8801234567890'
                        className='flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group'
                      >
                        <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                          <Phone className='w-4 h-4 text-primary' />
                        </div>
                        <span>+880 123 456 7890</span>
                      </a>
                      <a
                        href='mailto:support@gosharebd.com'
                        className='flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group'
                      >
                        <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                          <Mail className='w-4 h-4 text-primary' />
                        </div>
                        <span>support@gosharebd.com</span>
                      </a>
                      <Button
                        variant='outline'
                        className='w-full gap-2 hover:bg-primary hover:text-primary-foreground transition-colors'
                        size='sm'
                      >
                        <MessageCircle className='w-4 h-4' />
                        Start Live Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
