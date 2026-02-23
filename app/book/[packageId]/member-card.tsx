import { ChevronDown, ChevronUp, User } from 'lucide-react';
import { useState } from 'react';
import type { useForm } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { BookingFormValues } from './schema';

// ─── Member Card ──────────────────────────────────────────────────────────────
export default function MemberCard({
  index,
  tierLabel,
  form,
}: {
  index: number;
  tierLabel: string;
  form: ReturnType<typeof useForm<BookingFormValues>>;
}) {
  const [open, setOpen] = useState(index === 0);
  const fullName = form.watch(`members.${index}.fullName`);
  const errors = form.formState.errors.members?.[index];
  const hasErrors = !!errors && Object.keys(errors).length > 0;

  return (
    <div
      className={cn(
        'border rounded-xl overflow-hidden transition-colors',
        hasErrors ? 'border-destructive/60' : 'border-border',
      )}
    >
      {/* Accordion header */}
      <button
        type='button'
        onClick={() => setOpen((p) => !p)}
        className='w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left'
      >
        <div className='flex items-center gap-2.5'>
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
              hasErrors ? 'bg-destructive/10' : 'bg-primary/10',
            )}
          >
            <User
              className={cn(
                'w-3.5 h-3.5',
                hasErrors ? 'text-destructive' : 'text-primary',
              )}
            />
          </div>
          <div>
            <p className='text-sm font-medium leading-tight'>
              {fullName || `Traveller ${index + 1}`}
            </p>
            <div className='flex items-center gap-1.5'>
              <p className='text-xs text-muted-foreground'>{tierLabel}</p>
              {hasErrors && (
                <span className='text-xs text-destructive font-medium'>
                  · Incomplete
                </span>
              )}
            </div>
          </div>
        </div>
        {open ? (
          <ChevronUp className='w-4 h-4 text-muted-foreground shrink-0' />
        ) : (
          <ChevronDown className='w-4 h-4 text-muted-foreground shrink-0' />
        )}
      </button>

      {/* Fields */}
      {open && (
        <div className='p-4'>
          <FieldGroup className='flex flex-col gap-4'>
            {/* Full name — full width */}
            <Field data-invalid={!!errors?.fullName}>
              <FieldLabel htmlFor={`members.${index}.fullName`}>
                Full Name
              </FieldLabel>
              <Input
                id={`members.${index}.fullName`}
                placeholder='As on National ID / Passport'
                aria-invalid={!!errors?.fullName}
                {...form.register(`members.${index}.fullName`)}
              />
              <FieldError
                errors={errors?.fullName ? [errors.fullName] : undefined}
              />
            </Field>

            <div className='grid sm:grid-cols-2 gap-4'>
              {/* Gender */}
              <Field data-invalid={!!errors?.gender}>
                <FieldLabel htmlFor={`members.${index}.gender`}>
                  Gender
                </FieldLabel>
                <Select
                  value={form.watch(`members.${index}.gender`)}
                  onValueChange={(v) =>
                    form.setValue(
                      `members.${index}.gender`,
                      v as 'male' | 'female' | 'other',
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger
                    id={`members.${index}.gender`}
                    aria-invalid={!!errors?.gender}
                  >
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='male'>Male</SelectItem>
                    <SelectItem value='female'>Female</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  errors={errors?.gender ? [errors.gender] : undefined}
                />
              </Field>

              {/* ID number */}
              <Field data-invalid={!!errors?.idNumber}>
                <FieldLabel htmlFor={`members.${index}.idNumber`}>
                  National ID / Passport No.
                </FieldLabel>
                <Input
                  id={`members.${index}.idNumber`}
                  placeholder='e.g. 1234567890123'
                  aria-invalid={!!errors?.idNumber}
                  {...form.register(`members.${index}.idNumber`)}
                />
                <FieldError
                  errors={errors?.idNumber ? [errors.idNumber] : undefined}
                />
              </Field>

              {/* Email */}
              <Field data-invalid={!!errors?.email}>
                <FieldLabel htmlFor={`members.${index}.email`}>
                  Email Address
                </FieldLabel>
                <Input
                  id={`members.${index}.email`}
                  type='email'
                  placeholder='you@example.com'
                  aria-invalid={!!errors?.email}
                  {...form.register(`members.${index}.email`)}
                />
                <FieldError
                  errors={errors?.email ? [errors.email] : undefined}
                />
              </Field>

              {/* Phone */}
              <Field data-invalid={!!errors?.phone}>
                <FieldLabel htmlFor={`members.${index}.phone`}>
                  Phone Number
                </FieldLabel>
                <Input
                  id={`members.${index}.phone`}
                  placeholder='+880 1XXX-XXXXXX'
                  aria-invalid={!!errors?.phone}
                  {...form.register(`members.${index}.phone`)}
                />
                <FieldError
                  errors={errors?.phone ? [errors.phone] : undefined}
                />
              </Field>
            </div>
          </FieldGroup>
        </div>
      )}
    </div>
  );
}
