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
    <div>
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
