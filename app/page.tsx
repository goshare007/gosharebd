import {
  Cta,
  Features,
  Hero,
  PopularDestinations,
  Testimonials,
} from '@/components/landing';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';

export default function Page() {
  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-secondary/5'>
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
