import {
  Cta,
  Features,
  Hero,
  PopularPackages,
  Testimonials,
} from '@/components/landing';
import Footer from '@/components/layout/footer/footer';
import Header from '@/components/layout/header/header';

export default function Page() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        <Hero />
        <Features />
        <PopularPackages />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
