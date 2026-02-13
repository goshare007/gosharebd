'use client';
import {
  Calendar,
  DollarSign,
  MapPin,
  Shield,
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
  const features = [
    {
      icon: Star,
      title: 'Verified Tours & Guides',
      description:
        'All tours and guides are thoroughly verified to ensure quality and authenticity of experiences.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: DollarSign,
      title: 'Best Price Guarantee',
      description:
        "We guarantee the most competitive prices. Find a better deal and we'll match it.",
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description:
        'Connect with local guides and fellow travelers. Share experiences and build lasting friendships.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Real Reviews',
      description:
        'Honest reviews from real travelers help you make informed decisions about your tours.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Calendar,
      title: 'Flexible Booking',
      description:
        'Book and cancel with ease. We offer flexible booking options and instant confirmations.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
    {
      icon: MapPin,
      title: 'Explore More',
      description:
        'Discover hidden gems and authentic experiences beyond the typical tourist attractions.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <section
      id='features'
      className='py-12 bg-linear-to-b from-background to-secondary/20 relative overflow-hidden'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Section header */}
        <div className='text-center space-y-4 mb-16 animate-in fade-in slide-in-from-bottom duration-700'>
          <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20 mb-4'>
            <Shield className='w-4 h-4' />
            <span>Trusted & Reliable</span>
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold tracking-tight text-foreground'>
            Why Choose GoShare<span className='text-primary'>BD</span>?
          </h2>
          <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
            Everything you need for an unforgettable travel experience
          </p>
        </div>

        {/* Features grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
          {features.map((feature, idx) => (
            <Card
              // biome-ignore lint/suspicious/noArrayIndexKey: this is fine
              key={idx}
              className='group border-2 bg-background hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-default animate-in fade-in slide-in-from-bottom'
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className='space-y-4'>
                <div
                  className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <CardTitle className='text-xl font-bold group-hover:text-primary transition-colors'>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-base leading-relaxed'>
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
