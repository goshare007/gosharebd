'use client';
import { ArrowRight, MapPin, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PopularDestinations() {
  const destinations = [
    {
      name: 'Sundarbans',
      tours: '45 Tours',
      rating: '4.9',
      travelers: '2,450+',
      image:
        'https://images.unsplash.com/photo-1627491922812-30d9e485c0fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN5bGhldHxlbnwwfHwwfHx8MA%3D%3D',
      description: "World's largest mangrove forest",
    },
    {
      name: "Cox's Bazar",
      tours: '38 Tours',
      rating: '4.8',
      travelers: '3,120+',
      image:
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
      description: 'Longest natural beach in the world',
    },
    {
      name: 'Sylhet Tea Gardens',
      tours: '32 Tours',
      rating: '4.7',
      travelers: '1,890+',
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      description: 'Rolling hills of lush tea plantations',
    },
    {
      name: 'Chittagong Hill Tracts',
      tours: '28 Tours',
      rating: '4.9',
      travelers: '1,650+',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      description: 'Scenic mountain landscapes',
    },
    {
      name: 'Dhaka City Tour',
      tours: '50+ Tours',
      rating: '4.6',
      travelers: '4,200+',
      image:
        'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
      description: 'Historic capital city exploration',
    },
    {
      name: 'Bandarban Adventure',
      tours: '35 Tours',
      rating: '4.8',
      travelers: '2,100+',
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
      description: 'Mountain trekking & tribal culture',
    },
  ];

  return (
    <section
      id='destinations'
      className='py-12 md:py-20 bg-linear-to-br from-secondary/10 to-background relative overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Section header */}
        <div className='text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-700'>
          <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-4'>
            <MapPin className='w-4 h-4' />
            <span>Explore Bangladesh</span>
          </div>
          <h2 className='text-4xl font-display sm:text-5xl font-bold text-foreground'>
            Popular Destinations
          </h2>
          <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
            Explore the most visited and loved destinations in Bangladesh
          </p>
        </div>

        {/* Destinations grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {destinations.map((destination, idx) => (
            <Card
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              key={idx}
              className='group border-2 pt-0 overflow-hidden hover:border-primary/50 hover:shadow-2xl transition-all duration-500 cursor-pointer bg-background animate-in fade-in slide-in-from-bottom'
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Image section */}
              <div className='relative h-56 overflow-hidden'>
                <Image
                  src={destination.image}
                  alt={destination.name}
                  height={720}
                  width={1080}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                />
                {/* Gradient overlay */}
                <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent' />

                {/* Floating badge */}
                <div className='absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg'>
                  <Star className='w-3.5 h-3.5 fill-primary text-primary' />
                  <span className='text-sm font-bold'>
                    {destination.rating}
                  </span>
                </div>

                {/* Bottom info on image */}
                <div className='absolute bottom-4 left-4 right-4'>
                  <p className='text-white/90 text-sm mb-1'>
                    {destination.description}
                  </p>
                  <h3 className='text-white text-2xl font-bold'>
                    {destination.name}
                  </h3>
                </div>
              </div>

              {/* Card content */}
              <CardContent className='p-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <MapPin className='w-4 h-4 text-primary' />
                    <span className='text-sm font-medium'>
                      {destination.tours} available
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Users className='w-4 h-4 text-primary' />
                    <span className='text-sm font-medium'>
                      {destination.travelers}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant='outline'
                  className='w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all'
                >
                  View Tours
                  <ArrowRight className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
