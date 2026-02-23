import { format } from 'date-fns';
import { CheckCircle2, Clock, MapPin, Shield, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { SinglePackageType } from '@/types/package';
import calcPricing from './helper';
import type { BookingFormValues } from './schema';

// ─── Pricing Summary Sidebar ──────────────────────────────────────────────────
export default function PricingSummary({
  pkg,
  group,
  travelDate,
}: {
  pkg: SinglePackageType;
  group: BookingFormValues['group'];
  travelDate: Date | undefined;
}) {
  const { breakdown, subtotal, vat, total, paxCount } = calcPricing(pkg, group);

  return (
    <div className='space-y-6'>
      <div className='relative h-52 rounded-2xl overflow-hidden'>
        <Image
          src={pkg.coverImage}
          alt={pkg.name}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/70 to-transparent' />
        {pkg.isBestseller && (
          <div className='absolute top-3 left-3'>
            <Badge className='bg-primary text-primary-foreground text-xs font-semibold'>
              Bestseller
            </Badge>
          </div>
        )}
        <div className='absolute bottom-4 left-4 right-4 text-white'>
          <h2 className='font-display text-lg font-bold leading-tight'>
            {pkg.name}
          </h2>
          <div className='flex items-center gap-1.5 mt-1 text-xs text-white/80'>
            <MapPin className='w-3 h-3' />
            <span>{pkg.Location}</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-2'>
        {[
          { icon: Clock, label: 'Duration', value: `${pkg.durationDays}d` },
          { icon: Users, label: 'Travellers', value: `${paxCount} pax` },
          { icon: Shield, label: 'Status', value: 'Verified' },
          ...(pkg.averageRating
            ? [
                {
                  icon: Star,
                  label: 'Rating',
                  value: `${pkg.averageRating} (${pkg.reviewCount})`,
                },
              ]
            : []),
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className='bg-primary/5 rounded-xl p-3 text-center'>
            <Icon className='w-3.5 h-3.5 text-primary mx-auto mb-1' />
            <p className='text-xs text-muted-foreground'>{label}</p>
            <p className='text-xs font-semibold'>{value}</p>
          </div>
        ))}
      </div>

      {pkg.highlights?.length > 0 && (
        <div className='space-y-2'>
          <p className='text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground'>
            Highlights
          </p>
          <ul className='space-y-1.5'>
            {pkg.highlights.slice(0, 4).map((h, i) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: static
                key={i}
                className='flex items-start gap-2 text-xs text-muted-foreground'
              >
                <CheckCircle2 className='w-3 h-3 text-primary shrink-0 mt-0.5' />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator />

      <div className='space-y-2 text-sm'>
        {breakdown.map(
          ({ key, count, total: lineTotal, multiplier, label }) => {
            if (count === 0) return null;
            return (
              <div
                key={key}
                className='flex justify-between text-muted-foreground'
              >
                <span>
                  {label} × {count}
                  {multiplier > 0 && multiplier < 1 && (
                    <span className='text-xs ml-1'>({multiplier * 100}%)</span>
                  )}
                  {multiplier === 0 && (
                    <span className='text-xs ml-1'>(free)</span>
                  )}
                </span>
                {multiplier === 0 ? (
                  <span className='text-green-600 font-medium'>৳0</span>
                ) : (
                  <span>৳{lineTotal.toLocaleString()}</span>
                )}
              </div>
            );
          },
        )}

        {travelDate && (
          <div className='flex justify-between text-muted-foreground'>
            <span>Travel date</span>
            <span>{format(travelDate, 'dd MMM yyyy')}</span>
          </div>
        )}

        <Separator />

        <div className='flex justify-between text-muted-foreground'>
          <span>Subtotal</span>
          <span>৳{subtotal.toLocaleString()}</span>
        </div>
        <div className='flex justify-between text-muted-foreground'>
          <span>VAT (15%)</span>
          <span>৳{Math.round(vat).toLocaleString()}</span>
        </div>

        <Separator />

        <div className='flex justify-between font-bold text-base'>
          <span>Total</span>
          <span className='text-primary'>
            ৳{Math.round(total).toLocaleString()}
          </span>
        </div>
        <p className='text-xs text-muted-foreground'>
          * Final price confirmed after review
        </p>
      </div>
    </div>
  );
}
