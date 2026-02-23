export const VAT_RATE = 0.15;

export const TIERS = {
  adult: {
    label: 'Adults',
    sublabel: '15+ years',
    multiplier: 1,
    needsDetails: true,
  },
  preteen: {
    label: 'Pre-teen',
    sublabel: '11–14 years · 75%',
    multiplier: 0.75,
    needsDetails: true,
  },
  child: {
    label: 'Children',
    sublabel: '6–10 years · 50%',
    multiplier: 0.5,
    needsDetails: false,
  },
  infant: {
    label: 'Under 5',
    sublabel: '0–5 years · Free',
    multiplier: 0,
    needsDetails: false,
  },
} as const;
