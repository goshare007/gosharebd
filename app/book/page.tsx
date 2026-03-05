'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAllPackages } from '@/services/packages';

// ─── Package Selector ─────────────────────────────────────────────────────────
function PackageSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const { data: packages, isPending } = useAllPackages();

  return (
    <div className='space-y-1.5'>
      <Label>Select a Package</Label>
      <Select value={value} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger className='h-11'>
          <SelectValue
            placeholder={
              isPending ? 'Loading packages…' : 'Choose a tour package'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {packages?.map((p) => (
            <SelectItem key={p.id} value={p.slug}>
              {p.name}
              <span className='ml-2 text-xs text-muted-foreground'>
                · {p.location} · ৳{Number(p.pricePerPerson).toLocaleString()}
                /person
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BookNowPage() {
  const router = useRouter();
  const [selectedPackageId, setSelectedPackageId] = useState('');

  const handlePackageSelect = (id: string) => {
    setSelectedPackageId(id);
    router.replace(`/book/${id}`, { scroll: false });
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <section className='relative pt-12 pb-8 bg-primary/5 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='h-px w-10 bg-primary' />
            <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
              Book Now
            </span>
          </div>
          <h1 className='font-display text-3xl sm:text-4xl font-bold leading-tight'>
            Reserve your{' '}
            <span className='italic font-light text-muted-foreground'>
              spot
            </span>
            <span className='text-primary'>.</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className='py-10 md:py-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 items-start'>
            {/* Left: placeholder until package is selected */}
            <div className='lg:sticky lg:top-8 rounded-2xl border-2 border-dashed border-border p-10 text-center text-muted-foreground text-sm'>
              Select a package to see pricing
            </div>

            {/* Right: package selector */}
            <div>
              <div className='flex items-center gap-3 mb-4'>
                <div className='h-px w-8 bg-primary' />
                <span className='text-xs font-semibold tracking-[0.2em] uppercase text-primary'>
                  Choose Package
                </span>
              </div>
              <PackageSelector
                value={selectedPackageId}
                onChange={handlePackageSelect}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
