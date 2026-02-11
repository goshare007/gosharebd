'use client';

import {
  Calendar,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Features() {
  return (
    <section id='features' className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center space-y-4 mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold text-foreground'>
            Why Choose GoShareBD?
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Everything you need for an unforgettable travel experience
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              icon: Star,
              title: 'Verified Tours & Guides',
              description:
                'All tours and guides are thoroughly verified to ensure quality and authenticity of experiences.',
            },
            {
              icon: DollarSign,
              title: 'Best Price Guarantee',
              description:
                "We guarantee the most competitive prices. Find a better deal and we'll match it.",
            },
            {
              icon: Users,
              title: 'Community Driven',
              description:
                'Connect with local guides and fellow travelers. Share experiences and build lasting friendships.',
            },
            {
              icon: TrendingUp,
              title: 'Real Reviews',
              description:
                'Honest reviews from real travelers help you make informed decisions about your tours.',
            },
            {
              icon: Calendar,
              title: 'Flexible Booking',
              description:
                'Book and cancel with ease. We offer flexible booking options and instant confirmations.',
            },
            {
              icon: MapPin,
              title: 'Explore More',
              description:
                'Discover hidden gems and authentic experiences beyond the typical tourist attractions.',
            },
          ].map((feature, idx) => (
            <Card
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              key={idx}
              className='border-0 bg-linear-to-br from-background to-secondary/5 hover:shadow-lg transition-shadow'
            >
              <CardHeader>
                <feature.icon className='w-8 h-8 text-primary mb-4' />
                <CardTitle className='text-lg'>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base'>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
