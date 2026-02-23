import { Baby, User, Users } from 'lucide-react';
import { TIERS, VAT_RATE } from '@/constants/vat-rate';
import type { SinglePackageType } from '@/types/package';
import type { BookingFormValues } from './schema';

// ─── Constants ────────────────────────────────────────────────────────────────
export type TierKey = keyof typeof TIERS;

export const TIER_ICONS: Record<TierKey, React.ElementType> = {
  adult: User,
  preteen: User,
  child: Users,
  infant: Baby,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export default function calcPricing(
  pkg: SinglePackageType,
  group: BookingFormValues['group'],
) {
  const base = Number(pkg.pricePerPerson);
  const breakdown = (Object.keys(TIERS) as TierKey[]).map((key) => ({
    key,
    count: group[key],
    total: base * TIERS[key].multiplier * group[key],
    multiplier: TIERS[key].multiplier,
    label: TIERS[key].label,
  }));
  const subtotal = breakdown.reduce((s, r) => s + r.total, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;
  const paxCount = (Object.keys(TIERS) as TierKey[]).reduce(
    (s, k) => s + group[k],
    0,
  );
  return { breakdown, subtotal, vat, total, paxCount };
}
