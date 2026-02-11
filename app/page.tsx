/** biome-ignore-all lint/suspicious/noArrayIndexKey: this is fine */

import {
  ArrowRight,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-secondary/5'>
      {/* Navigation */}
      <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>GS</span>
            </div>
            <span className='font-bold text-lg text-foreground'>GoShareBD</span>
          </div>
          <div className='hidden md:flex items-center gap-8'>
            <a
              href='#destinations'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Destinations
            </a>
            <a
              href='#features'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Why Us
            </a>
            <a
              href='#testimonials'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Reviews
            </a>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='ghost' size='sm'>
              Log in
            </Button>
            <Button size='sm' className='bg-primary hover:bg-primary/90'>
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <div className='space-y-8'>
              <div className='space-y-4'>
                <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance'>
                  Discover Authentic Travel Experiences
                </h1>
                <p className='text-lg text-muted-foreground max-w-lg'>
                  Book amazing tours and connect with local guides. Create
                  unforgettable memories with GoShareBD.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button size='lg' className='bg-primary hover:bg-primary/90'>
                  Explore Tours <ArrowRight className='ml-2 w-4 h-4' />
                </Button>
                <Button size='lg' variant='outline'>
                  Learn More
                </Button>
              </div>
              <div className='flex items-center gap-8 pt-4'>
                <div>
                  <p className='text-2xl font-bold text-primary'>500+</p>
                  <p className='text-sm text-muted-foreground'>
                    Tours Available
                  </p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-primary'>10K+</p>
                  <p className='text-sm text-muted-foreground'>
                    Happy Travelers
                  </p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-primary'>4.8★</p>
                  <p className='text-sm text-muted-foreground'>
                    Average Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Search Card */}
            <div className='relative'>
              <div className='bg-white rounded-2xl shadow-2xl p-8 space-y-6'>
                <h2 className='text-2xl font-bold text-foreground'>
                  Find Your Next Adventure
                </h2>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Destination</Label>
                    <div className='flex items-center gap-2 bg-muted rounded-lg px-4 py-3'>
                      <MapPin className='w-5 h-5 text-primary' />
                      <Input
                        placeholder='Where are you going?'
                        className='bg-transparent border-0 focus:outline-none'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Check-in</Label>
                      <div className='flex items-center gap-2 bg-muted rounded-lg px-4 py-3'>
                        <Calendar className='w-5 h-5 text-primary' />
                        <Input
                          type='date'
                          className='bg-transparent border-0 focus:outline-none text-sm'
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label>Check-out</Label>
                      <div className='flex items-center gap-2 bg-muted rounded-lg px-4 py-3'>
                        <Calendar className='w-5 h-5 text-primary' />
                        <Input
                          type='date'
                          className='bg-transparent border-0 focus:outline-none text-sm'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label>Travelers</Label>
                    <div className='flex items-center gap-2 bg-muted rounded-lg px-4 py-3'>
                      <Users className='w-5 h-5 text-primary' />
                      <Input
                        type='number'
                        placeholder='Number of travelers'
                        className='bg-transparent border-0 focus:outline-none'
                      />
                    </div>
                  </div>
                </div>

                <Button
                  size='lg'
                  className='w-full bg-primary hover:bg-primary/90 text-base'
                >
                  <Search className='w-5 h-5 mr-2' />
                  Search Tours
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
                key={idx}
                className='border-0 bg-gradient-to-br from-background to-secondary/5 hover:shadow-lg transition-shadow'
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

      {/* Popular Destinations */}
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
                key={idx}
                className='border-0 overflow-hidden hover:shadow-xl transition-all group cursor-pointer bg-white'
              >
                <div className='bg-gradient-to-br from-primary to-secondary h-40 relative overflow-hidden'>
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

      {/* Testimonials */}
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
                key={idx}
                className='border-0 bg-gradient-to-br from-background to-secondary/5'
              >
                <CardHeader>
                  <div className='flex gap-1 mb-4'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
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

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-primary to-secondary text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8'>
          <h2 className='text-3xl sm:text-4xl font-bold text-balance'>
            Ready to Start Your Adventure?
          </h2>
          <p className='text-lg opacity-90 max-w-2xl mx-auto'>
            Join thousands of travelers discovering authentic experiences with
            GoShareBD. Your next unforgettable journey is just a click away.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
            <Button
              size='lg'
              className='bg-white text-primary hover:bg-white/90'
            >
              Book Your Tour <ArrowRight className='ml-2 w-4 h-4' />
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-white text-white hover:bg-white/10 bg-transparent'
            >
              View All Tours
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-foreground text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>GS</span>
                </div>
                <span className='font-bold text-lg'>GoShareBD</span>
              </div>
              <p className='text-sm opacity-80'>
                Discover authentic travel experiences with GoShareBD.
              </p>
            </div>
            <div>
              <h3 className='font-semibold mb-4'>Company</h3>
              <ul className='space-y-2 text-sm opacity-80'>
                <li>
                  <a href='/about' className='hover:opacity-100 transition'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='/careers' className='hover:opacity-100 transition'>
                    Careers
                  </a>
                </li>
                <li>
                  <a href='/blog' className='hover:opacity-100 transition'>
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-4'>Support</h3>
              <ul className='space-y-2 text-sm opacity-80'>
                <li>
                  <a href='/help' className='hover:opacity-100 transition'>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href='/contact' className='hover:opacity-100 transition'>
                    Contact
                  </a>
                </li>
                <li>
                  <a href='/safety' className='hover:opacity-100 transition'>
                    Safety
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-4'>Legal</h3>
              <ul className='space-y-2 text-sm opacity-80'>
                <li>
                  <a href='/privacy' className='hover:opacity-100 transition'>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href='/terms' className='hover:opacity-100 transition'>
                    Terms
                  </a>
                </li>
                <li>
                  <a href='/cookies' className='hover:opacity-100 transition'>
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='border-t border-white/10 pt-8'>
            <p className='text-sm opacity-80 text-center'>
              © 2026 GoShareBD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
