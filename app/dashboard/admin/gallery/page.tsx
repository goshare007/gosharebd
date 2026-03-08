'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminPackagesWithGallery } from '@/services/packages';
import { GalleryManager } from './GalleryManager';

const AdminGalleryPage = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );

  const {
    data: packages,
    isLoading,
    isError,
    error,
  } = useAdminPackagesWithGallery();

  const selectedPackage = useMemo(() => {
    if (!selectedPackageId || !packages) return null;
    return packages.find((p) => p.id === selectedPackageId);
  }, [selectedPackageId, packages]);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-12 w-1/3' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='text-red-500'>
        <p>An error occurred while fetching packages:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Select a Package to Manage its Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={setSelectedPackageId}
            value={selectedPackageId || ''}
          >
            <SelectTrigger className='w-full md:w-1/2'>
              <SelectValue placeholder='Choose a package...' />
            </SelectTrigger>
            <SelectContent>
              {packages?.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPackage && (
        <Card>
          <CardHeader>
            <CardTitle>
              Manage Gallery for &quot;{selectedPackage.name}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryManager packageData={selectedPackage} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminGalleryPage;
