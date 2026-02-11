'use client';

import { Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';

export default function Testimonials() {
  return (
    <section id='testimonials' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center space-y-4 mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold text-foreground'>
            What Our Travelers Say
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Real experiences from real travelers
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              name: 'Sarah Khan',
              location: 'Dhaka',
              text: 'GoShareBD made it so easy to find authentic tours! The guides were knowledgeable and friendly. Best trip ever!',
              rating: 5,
            },
            {
              name: 'Ahmed Hassan',
              location: 'Chittagong',
              text: 'The Sundarbans tour was absolutely incredible. Worth every taka. Highly recommend GoShareBD!',
              rating: 5,
            },
            {
              name: 'Priya Roy',
              location: 'Sylhet',
              text: "Amazing experiences and even better prices. The community here is so welcoming. Can't wait to book again!",
              rating: 5,
            },
          ].map((testimonial, idx) => (
            <Card
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              key={idx}
              className='border-0 bg-linear-to-br from-background to-secondary/5'
            >
              <CardHeader>
                <div className='flex gap-1 mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
                      key={i}
                      className='w-4 h-4 fill-primary text-primary'
                    />
                  ))}
                </div>
                <CardDescription className='text-base text-foreground font-normal leading-relaxed'>
                  "{testimonial.text}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='font-semibold text-foreground'>
                  {testimonial.name}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {testimonial.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
