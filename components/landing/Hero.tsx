'use client';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Hero() {
  return (
    <section className='relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32'>
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
                Join our expertly curated scheduled tours. Professional guides,
                fixed departures, and authentic experiences across
                Bangladesh&apos;s most beautiful destinations.
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
                <p className='text-sm text-muted-foreground mt-1'>Avg Rating</p>
              </div>
            </div>
          </div>

          {/* Right - Tour Search Card */}
          <div className='relative'>
            <Card className='relative p-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-2xl border-0 overflow-hidden'>
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
                        Cox&apos;s Bazar Beach
                      </SelectItem>
                      <SelectItem value='sylhet'>Sylhet Tea Gardens</SelectItem>
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
  );
}
