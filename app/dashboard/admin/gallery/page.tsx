'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAdminPackagesList,
  useAdminSinglePackageWithGallery,
} from '@/services/packages';
import { GalleryManager } from './GalleryManager';

const AdminGalleryPage = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );

  const { data: packages, isLoading: isLoadingPackages } =
    useAdminPackagesList();

  const { data: selectedPackageData, isLoading: isLoadingSelectedPackage } =
    useAdminSinglePackageWithGallery(selectedPackageId);

  if (isLoadingPackages) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-12 w-1/3' />
        <Skeleton className='h-64 w-full' />
      </div>
    );
  }

  if (!packages) {
    return (
      <div className='text-red-500'>
        <p>Failed to load packages</p>
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
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoadingSelectedPackage && selectedPackageId ? (
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className='h-64 w-full' />
          </CardContent>
        </Card>
      ) : selectedPackageData ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Manage Gallery for &quot;{selectedPackageData.name}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GalleryManager packageData={selectedPackageData} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default AdminGalleryPage;
