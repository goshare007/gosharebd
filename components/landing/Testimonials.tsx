'use client';
import { Quote, Star } from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Khan',
      location: 'Dhaka',
      text: 'GoShareBD made it so easy to find authentic tours! The guides were knowledgeable and friendly. Best trip ever to the Sundarbans!',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      tour: 'Sundarbans Safari',
    },
    {
      name: 'Ahmed Hassan',
      location: 'Chittagong',
      text: 'The Sundarbans tour was absolutely incredible. Worth every taka. The wildlife, the scenery, everything was perfect. Highly recommend GoShareBD!',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      tour: 'Mangrove Explorer',
    },
    {
      name: 'Priya Roy',
      location: 'Sylhet',
      text: "Amazing experiences and even better prices. The tea garden tour was breathtaking. The community here is so welcoming. Can't wait to book again!",
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      tour: 'Tea Garden Tour',
    },
    {
      name: 'Rafiq Ahmed',
      location: 'Bandarban',
      text: 'The mountain trek exceeded all expectations. Professional guides, stunning views, and well-organized itinerary. GoShareBD is the best!',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      tour: 'Mountain Adventure',
    },
    {
      name: 'Nadia Islam',
      location: "Cox's Bazar",
      text: 'Beach tour was fantastic! Great value for money and the sunset views were unforgettable. Will definitely recommend to friends and family.',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      tour: 'Beach Paradise',
    },
  ];

  return (
    <section
      id='testimonials'
      className='py-12 md:py-16 bg-linear-to-b from-background to-secondary/20 relative overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Section header */}
        <div className='text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-700'>
          <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-4'>
            <Star className='w-4 h-4 fill-primary' />
            <span>Trusted Reviews</span>
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold text-foreground'>
            What Our Travelers Say
          </h2>
          <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
            Real experiences from real travelers across Bangladesh
          </p>
        </div>

        {/* Carousel */}
        <div
          className='animate-in fade-in duration-700'
          style={{ animationDelay: '200ms' }}
        >
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-4'>
              {testimonials.map((testimonial, idx) => (
                <CarouselItem
                  // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                  key={idx}
                  className='pl-4 md:basis-1/2 lg:basis-1/3'
                >
                  <Card className='border-2 h-full hover:border-primary/50 hover:shadow-xl transition-all duration-300 group bg-background'>
                    <CardHeader className='space-y-6'>
                      {/* Quote icon */}
                      <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <Quote className='w-6 h-6 text-primary' />
                      </div>

                      {/* Stars */}
                      <div className='flex gap-1'>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                            key={i}
                            className='w-4 h-4 fill-primary text-primary'
                          />
                        ))}
                      </div>

                      {/* Testimonial text */}
                      <CardDescription className='text-base text-foreground leading-relaxed'>
                        "{testimonial.text}"
                      </CardDescription>
                    </CardHeader>

                    <CardContent className='space-y-4'>
                      {/* Tour tag */}
                      <div className='inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-xs font-medium'>
                        {testimonial.tour}
                      </div>

                      {/* Profile */}
                      <div className='flex items-center gap-4 pt-4 border-t'>
                        <div className='w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20'>
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div>
                          <p className='font-bold text-foreground'>
                            {testimonial.name}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden md:flex -left-6' />
            <CarouselNext className='hidden md:flex -right-6' />
          </Carousel>
        </div>

        {/* Stats section */}
        <div
          className='mt-20 pt-16 border-t border-border animate-in fade-in duration-700'
          style={{ animationDelay: '400ms' }}
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div className='space-y-2'>
              <div className='flex items-center justify-center gap-2'>
                <Star className='w-5 h-5 text-primary fill-primary' />
                <p className='text-4xl md:text-5xl font-bold'>4.9</p>
              </div>
              <p className='text-muted-foreground'>Average Rating</p>
              <p className='text-sm text-muted-foreground'>
                From 5,000+ reviews
              </p>
            </div>
            <div className='space-y-2'>
              <p className='text-4xl md:text-5xl font-bold text-primary'>98%</p>
              <p className='text-muted-foreground'>Satisfaction Rate</p>
              <p className='text-sm text-muted-foreground'>
                Happy travelers worldwide
              </p>
            </div>
            <div className='space-y-2'>
              <p className='text-4xl md:text-5xl font-bold text-primary'>
                10K+
              </p>
              <p className='text-muted-foreground'>Verified Reviews</p>
              <p className='text-sm text-muted-foreground'>
                Authentic experiences shared
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
