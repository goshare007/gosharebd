'use client';

import { Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PopularDestinations() {
  return (
    <section
      id='destinations'
      className='py-20 bg-gradient-to-br from-secondary/10 to-accent/5'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center space-y-4 mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold text-foreground'>
            Popular Destinations
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Explore the most visited and loved destinations in Bangladesh
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[
            {
              name: 'Sundarbans',
              tours: '45 Tours',
              rating: '4.9',
              travelers: '2,450+',
            },
            {
              name: "Cox's Bazar",
              tours: '38 Tours',
              rating: '4.8',
              travelers: '3,120+',
            },
            {
              name: 'Sylhet Tea Gardens',
              tours: '32 Tours',
              rating: '4.7',
              travelers: '1,890+',
            },
            {
              name: 'Chittagong Hill Tracts',
              tours: '28 Tours',
              rating: '4.9',
              travelers: '1,650+',
            },
            {
              name: 'Dhaka City Tour',
              tours: '50+ Tours',
              rating: '4.6',
              travelers: '4,200+',
            },
            {
              name: 'Bandarban Adventure',
              tours: '35 Tours',
              rating: '4.8',
              travelers: '2,100+',
            },
          ].map((destination, idx) => (
            <Card
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              key={idx}
              className='border-0 overflow-hidden hover:shadow-xl transition-all group cursor-pointer bg-white'
            >
              <div className='bg-linear-to-br from-primary to-secondary h-40 relative overflow-hidden'>
                <div className='absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all' />
              </div>
              <CardHeader>
                <CardTitle className='text-xl'>{destination.name}</CardTitle>
                <CardDescription>{destination.tours}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1'>
                    <Star className='w-4 h-4 fill-primary text-primary' />
                    <span className='font-semibold text-sm'>
                      {destination.rating}
                    </span>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {destination.travelers} travelers
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
