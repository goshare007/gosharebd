/** biome-ignore-all lint/suspicious/noArrayIndexKey: this is fine */

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Search,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

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
              About
            </a>
            <a
              href='#destinations'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Package
            </a>
            <a
              href='#destinations'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Book a Tour
            </a>
            <a
              href='#features'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Festivals
            </a>
            <a
              href='#destinations'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Gallery
            </a>
            <a
              href='#testimonials'
              className='text-sm text-muted-foreground hover:text-foreground transition'
            >
              Reviews
            </a>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='ghost'>Log in</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - IMPROVED */}
      <section className='relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32'>
        {/* Background decoration */}
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
          <div className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            {/* Left Content */}
            <div className='space-y-8'>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium'>
                <CheckCircle2 className='w-4 h-4' />
                <span>Trusted by 10,000+ Travelers</span>
              </div>

              <div className='space-y-6'>
                <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight'>
                  Explore Bangladesh
                  <span className='block text-primary mt-2'>Your Way</span>
                </h1>
                <p className='text-xl text-muted-foreground max-w-xl leading-relaxed'>
                  Join our expertly curated scheduled tours. Professional
                  guides, fixed departures, and authentic experiences across
                  Bangladesh's most beautiful destinations.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <Button
                  size='lg'
                  className='bg-primary hover:bg-primary/90 text-base h-12 px-8'
                >
                  Browse Scheduled Tours
                  <ArrowRight className='ml-2 w-5 h-5' />
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='text-base h-12 px-8'
                >
                  View Destinations
                </Button>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-3 gap-6 pt-8 border-t border-border'>
                <div>
                  <p className='text-3xl font-bold text-foreground'>500+</p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Scheduled Tours
                  </p>
                </div>
                <div>
                  <p className='text-3xl font-bold text-foreground'>50+</p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Destinations
                  </p>
                </div>
                <div>
                  <p className='text-3xl font-bold text-foreground'>4.8★</p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Avg Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Tour Search Card */}
            <div className='relative'>
              {/* Decorative elements */}
              <div className='absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl' />
              <div className='absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl' />

              <Card className='relative p-0 bg-white/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden'>
                {/* Card header with gradient */}
                <div className='bg-primary p-6 text-white'>
                  <h2 className='text-2xl font-bold mb-2'>
                    Find Your Perfect Tour
                  </h2>
                  <p className='text-sm opacity-90'>
                    Search from our scheduled departures
                  </p>
                </div>

                <CardContent className='p-6 space-y-5'>
                  {/* Destination Selection */}
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>
                      Choose Destination
                    </Label>
                    <Select>
                      <SelectTrigger className='h-12 bg-muted/50 border-0'>
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-5 h-5 text-primary' />
                          <SelectValue placeholder='Select a destination' />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='sundarbans'>
                          Sundarbans Mangrove Forest
                        </SelectItem>
                        <SelectItem value='coxs-bazar'>
                          Cox's Bazar Beach
                        </SelectItem>
                        <SelectItem value='sylhet'>
                          Sylhet Tea Gardens
                        </SelectItem>
                        <SelectItem value='chittagong'>
                          Chittagong Hill Tracts
                        </SelectItem>
                        <SelectItem value='bandarban'>
                          Bandarban Mountains
                        </SelectItem>
                        <SelectItem value='dhaka'>Dhaka City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tour Month */}
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Travel Month</Label>
                    <Select>
                      <SelectTrigger className='h-12 bg-muted/50 border-0'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-5 h-5 text-primary' />
                          <SelectValue placeholder='Select month' />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='feb-2026'>February 2026</SelectItem>
                        <SelectItem value='mar-2026'>March 2026</SelectItem>
                        <SelectItem value='apr-2026'>April 2026</SelectItem>
                        <SelectItem value='may-2026'>May 2026</SelectItem>
                        <SelectItem value='jun-2026'>June 2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tour Duration */}
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Tour Duration</Label>
                    <Select>
                      <SelectTrigger className='h-12 bg-muted/50 border-0'>
                        <div className='flex items-center gap-2'>
                          <Clock className='w-5 h-5 text-primary' />
                          <SelectValue placeholder='Select duration' />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1-day'>1 Day Trip</SelectItem>
                        <SelectItem value='2-3-days'>2-3 Days</SelectItem>
                        <SelectItem value='4-5-days'>4-5 Days</SelectItem>
                        <SelectItem value='week'>1 Week</SelectItem>
                        <SelectItem value='week-plus'>1 Week+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Travelers */}
                  <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Travelers</Label>
                    <div className='flex items-center gap-2 bg-muted/50 rounded-lg px-4 h-12'>
                      <Users className='w-5 h-5 text-primary' />
                      <Input
                        type='number'
                        min='1'
                        max='20'
                        defaultValue='2'
                        className='bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <Button
                    size='lg'
                    className='w-full bg-primary hover:bg-primary/90 text-base h-12 mt-2'
                  >
                    <Search className='w-5 h-5 mr-2' />
                    Search Available Tours
                  </Button>

                  {/* Quick info */}
                  <div className='flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <CheckCircle2 className='w-3 h-3 text-primary' />
                      <span>Fixed Departures</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <CheckCircle2 className='w-3 h-3 text-primary' />
                      <span>Expert Guides</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <CheckCircle2 className='w-3 h-3 text-primary' />
                      <span>Best Prices</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating badge */}
              <div className='absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-border'>
                <p className='text-xs font-medium text-foreground'>
                  🔥 New tours added weekly
                </p>
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
