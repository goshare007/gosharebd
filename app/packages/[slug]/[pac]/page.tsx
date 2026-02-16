'use client';

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Heart,
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
import { notFound } from 'next/navigation';
import { use, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { destinations } from '@/constants/destinations';

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; pac: string }>;
}) {
  const { slug, pac } = use(params);

  const destination = destinations.find((d) => d.slug === slug);
  const packageData = destination?.packages.find((p) => p.slug === pac);

  if (!packageData) {
    notFound();
  }

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [isLiked, setIsLiked] = useState(false);
  const [showCouple, setShowCouple] = useState(packageData.isCouple);

  const calculateSavings = () => {
    if (showCouple) {
      return (
        (packageData.originalCouplePrice || 0) - (packageData.couplePrice || 0)
      );
    }
    return (
      ((packageData.originalPricePerPerson || 0) -
        (packageData.pricePerPerson || 0)) *
      numberOfPeople
    );
  };

  const calculateTotal = () => {
    if (showCouple) {
      return packageData.couplePrice || 0;
    }
    return (packageData.pricePerPerson || 0) * numberOfPeople;
  };

  return (
    <div className='min-h-screen bg-background mt-16'>
      {/* Image Gallery */}
      <section className='relative h-[60vh] md:h-[70vh]'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 h-full'>
          <div className='md:col-span-2 relative h-full'>
            <Image
              src={packageData.images[0]}
              alt={packageData.title}
              fill
              className='object-cover'
              priority
            />
          </div>
          <div className='hidden md:grid grid-rows-2 gap-2'>
            <div className='relative'>
              <Image
                src={packageData.images[1]}
                alt={packageData.title}
                fill
                className='object-cover'
              />
            </div>
            <div className='relative'>
              <Image
                src={packageData.images[2]}
                alt={packageData.title}
                fill
                className='object-cover'
              />
            </div>
          </div>
        </div>

        {/* Overlay Buttons */}
        <div className='absolute top-6 left-4 sm:left-6 lg:left-8 z-10'>
          <Button
            variant='outline'
            size='sm'
            asChild
            className='gap-2 bg-background/80 backdrop-blur-sm'
          >
            <Link href={`/packages/${packageData.destinationSlug}`}>
              <ArrowLeft className='w-4 h-4' />
              Back
            </Link>
          </Button>
        </div>

        <div className='absolute top-6 right-4 sm:right-6 lg:right-8 z-10 flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='bg-background/80 backdrop-blur-sm'
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='bg-background/80 backdrop-blur-sm'
          >
            <Share2 className='w-4 h-4' />
          </Button>
        </div>
      </section>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Header */}
            <div className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                {packageData.isCouple && (
                  <Badge className='bg-pink-500/90'>❤️ Couple Package</Badge>
                )}
                <Badge variant='secondary'>{packageData.category}</Badge>
                <Link href={`/packages/${packageData.destinationSlug}`}>
                  <Badge
                    variant='outline'
                    className='hover:bg-secondary cursor-pointer'
                  >
                    <MapPin className='w-3 h-3 mr-1' />
                    {packageData.destination}
                  </Badge>
                </Link>
              </div>

              <h1 className='text-3xl md:text-4xl font-bold'>
                {packageData.title}
              </h1>
              <p className='text-lg text-muted-foreground'>
                {packageData.tagline}
              </p>

              <div className='flex flex-wrap items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                  <span className='font-semibold'>{packageData.rating}</span>
                  <span className='text-sm text-muted-foreground'>
                    {/* ({packageData.reviews} reviews) */}
                  </span>
                </div>
                <Separator orientation='vertical' className='h-6' />
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Clock className='w-4 h-4 text-primary' />
                  <span>{packageData.duration}</span>
                </div>
                <Separator orientation='vertical' className='h-6' />
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Users className='w-4 h-4 text-primary' />
                  <span>{packageData.groupSize}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue='overview' className='w-full'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='itinerary'>Itinerary</TabsTrigger>
                <TabsTrigger value='included'>Included</TabsTrigger>
                <TabsTrigger value='reviews'>Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='space-y-6 mt-6'>
                <div>
                  <h3 className='text-xl font-semibold mb-3'>
                    About This Tour
                  </h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {packageData.description}
                  </p>
                </div>

                <div>
                  <h3 className='text-xl font-semibold mb-3'>Highlights</h3>
                  <div className='grid sm:grid-cols-2 gap-3'>
                    {packageData.highlights.map((highlight, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      <div key={idx} className='flex items-start gap-2'>
                        <CheckCircle2 className='w-5 h-5 text-primary shrink-0 mt-0.5' />
                        <span className='text-sm'>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tour Guide */}
                <Card>
                  <CardContent className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Your Tour Guide
                    </h3>
                    <div className='flex items-start gap-4'>
                      <Avatar className='w-16 h-16'>
                        <AvatarImage src={packageData.tourGuide.image} />
                        <AvatarFallback>AG</AvatarFallback>
                      </Avatar>
                      <div className='flex-1'>
                        <h4 className='font-semibold'>
                          {packageData.tourGuide.name}
                        </h4>
                        <p className='text-sm text-muted-foreground mb-2'>
                          {packageData.tourGuide.role}
                        </p>
                        <div className='flex flex-wrap gap-4 text-sm text-muted-foreground'>
                          <div className='flex items-center gap-1'>
                            <Star className='w-4 h-4 text-primary fill-primary' />
                            <span>{packageData.tourGuide.rating}</span>
                          </div>
                          <span>
                            {packageData.tourGuide.experience} experience
                          </span>
                          <span>{packageData.tourGuide.tours} tours</span>
                        </div>
                        <div className='flex gap-2 mt-2'>
                          {packageData.tourGuide.languages.map((lang, idx) => (
                            <Badge
                              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                              key={idx}
                              variant='secondary'
                              className='text-xs'
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='itinerary' className='space-y-4 mt-6'>
                <h3 className='text-xl font-semibold'>Detailed Itinerary</h3>
                <div className='space-y-6'>
                  {packageData.itinerary.map((item, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                    <div key={idx} className='flex gap-4'>
                      <div className='flex flex-col items-center'>
                        <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
                          <Clock className='w-5 h-5 text-primary' />
                        </div>
                        {idx < packageData.itinerary.length - 1 && (
                          <div className='w-0.5 h-full bg-border mt-2' />
                        )}
                      </div>
                      <div className='flex-1 pb-6'>
                        <div className='flex items-center gap-3 mb-1'>
                          <Badge variant='outline'>{item.time}</Badge>
                          <h4 className='font-semibold'>{item.title}</h4>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value='included' className='space-y-6 mt-6'>
                <div>
                  <h3 className='text-xl font-semibold mb-4'>
                    What's Included
                  </h3>
                  <div className='grid sm:grid-cols-2 gap-3'>
                    {packageData.included.map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      <div key={idx} className='flex items-start gap-2'>
                        <CheckCircle2 className='w-5 h-5 text-green-500 shrink-0 mt-0.5' />
                        <span className='text-sm'>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className='text-xl font-semibold mb-4'>
                    What's Not Included
                  </h3>
                  <div className='grid sm:grid-cols-2 gap-3'>
                    {packageData.notIncluded.map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      <div key={idx} className='flex items-start gap-2'>
                        <X className='w-5 h-5 text-red-500 shrink-0 mt-0.5' />
                        <span className='text-sm'>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className='text-xl font-semibold mb-4'>
                    Important Information
                  </h3>
                  <div className='space-y-3'>
                    <div>
                      <h4 className='font-medium text-sm mb-1'>
                        Cancellation Policy
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {packageData.policies.cancellation}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-medium text-sm mb-1'>
                        Weather Policy
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {packageData.policies.weatherPolicy}
                      </p>
                    </div>
                    <div>
                      <h4 className='font-medium text-sm mb-1'>
                        Age Restriction
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {packageData.policies.ageRestriction}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='reviews' className='space-y-6 mt-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-xl font-semibold'>Guest Reviews</h3>
                  <div className='flex items-center gap-2'>
                    <Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
                    <span className='font-semibold text-lg'>
                      {packageData.rating}
                    </span>
                    <span className='text-muted-foreground'>
                      ({packageData.reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <div className='space-y-6'>
                  {packageData.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className='p-6'>
                        <div className='flex items-start gap-4'>
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className='flex-1'>
                            <div className='flex items-center justify-between mb-2'>
                              <div>
                                <h4 className='font-semibold'>{review.name}</h4>
                                <p className='text-sm text-muted-foreground'>
                                  {review.date}
                                </p>
                              </div>
                              <div className='flex items-center gap-1'>
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className='text-sm text-muted-foreground leading-relaxed'>
                              {review.comment}
                            </p>
                            {review.images.length > 0 && (
                              <div className='flex gap-2 mt-3'>
                                {review.images.map((img, idx) => (
                                  <div
                                    // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                                    key={idx}
                                    className='relative w-24 h-24 rounded-lg overflow-hidden'
                                  >
                                    <Image
                                      src={img}
                                      alt='Review'
                                      fill
                                      className='object-cover'
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-20 border-2'>
              <CardContent className='p-6 space-y-6'>
                {/* Pricing */}
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      {showCouple ? 'Price for Couple' : 'Price per Person'}
                    </h3>
                    {packageData.isCouple && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-xs h-auto p-1'
                        onClick={() => setShowCouple(!showCouple)}
                      >
                        {showCouple ? 'View per person' : 'View couple price'}
                      </Button>
                    )}
                  </div>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-3xl font-bold text-primary'>
                      ৳
                      {showCouple
                        ? (packageData.couplePrice || 0).toLocaleString()
                        : (packageData.pricePerPerson || 0).toLocaleString()}
                    </span>
                    <span className='text-lg text-muted-foreground line-through'>
                      ৳
                      {showCouple
                        ? (
                            packageData.originalCouplePrice || 0
                          ).toLocaleString()
                        : (
                            packageData.originalPricePerPerson || 0
                          ).toLocaleString()}
                    </span>
                  </div>
                  <p className='text-sm text-green-600 dark:text-green-400 mt-1'>
                    You save ৳
                    {(showCouple
                      ? (packageData.originalCouplePrice || 0) -
                        (packageData.couplePrice || 0)
                      : (packageData.originalPricePerPerson || 0) -
                        (packageData.pricePerPerson || 0)
                    ).toLocaleString()}
                  </p>
                </div>

                <Separator />

                {/* Date Selection */}
                <div>
                  <Label className='text-sm font-medium mb-2 block'>
                    Select Date
                  </Label>
                  <select
                    className='w-full h-10 px-3 rounded-md border border-input bg-background'
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value=''>Choose a date</option>
                    {packageData.availableDates.map((date) => (
                      <option key={date.date} value={date.date}>
                        {new Date(date.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        ({date.slots} spots left)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of People */}
                {!showCouple && (
                  <div>
                    <Label className='text-sm font-medium mb-2 block'>
                      Number of People
                    </Label>
                    <div className='flex items-center gap-3'>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          setNumberOfPeople(Math.max(1, numberOfPeople - 1))
                        }
                      >
                        -
                      </Button>
                      <span className='text-lg font-semibold w-12 text-center'>
                        {numberOfPeople}
                      </span>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Subtotal</span>
                    <span className='font-medium'>
                      ৳{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm text-green-600 dark:text-green-400'>
                    <span>Discount</span>
                    <span>-৳{calculateSavings().toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className='flex justify-between'>
                    <span className='font-semibold'>Total</span>
                    <span className='text-xl font-bold text-primary'>
                      ৳{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  className='w-full h-12'
                  size='lg'
                  disabled={!selectedDate}
                >
                  {selectedDate ? 'Book Now' : 'Select Date First'}
                </Button>

                <div className='space-y-2 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Shield className='w-4 h-4 text-primary' />
                    <span>Free cancellation up to 24h</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle2 className='w-4 h-4 text-primary' />
                    <span>Instant confirmation</span>
                  </div>
                </div>

                <Separator />

                {/* Contact */}
                <div className='space-y-3'>
                  <h4 className='font-semibold text-sm'>Need Help?</h4>
                  <div className='space-y-2 text-sm'>
                    <a
                      href='tel:+8801234567890'
                      className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
                    >
                      <Phone className='w-4 h-4' />
                      <span>+880 123 456 7890</span>
                    </a>
                    <a
                      href='mailto:support@gosharebd.com'
                      className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors'
                    >
                      <Mail className='w-4 h-4' />
                      <span>support@gosharebd.com</span>
                    </a>
                    <Button
                      variant='outline'
                      className='w-full gap-2'
                      size='sm'
                    >
                      <MessageCircle className='w-4 h-4' />
                      Chat with us
                    </Button>
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
