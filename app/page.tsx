import {
  Cta,
  Features,
  Footer,
  Header,
  Hero,
  PopularDestinations,
  Testimonials,
} from '@/components/landing';

export default function Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-secondary/5'>
      <Header />
      <Hero />
      <Features />
      <PopularDestinations />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
}
