import {
  Cta,
  Features,
  Hero,
  PopularDestinations,
  Testimonials,
} from '@/components/landing';

export default function Page() {
  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-secondary/5'>
      <Hero />
      <Features />
      <PopularDestinations />
      <Testimonials />
      <Cta />
    </div>
  );
}
