'use client';

import { ImagePlus, Loader2, Trash2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  useAddImageToPackage,
  useDeleteImageFromPackage,
  useUploadGalleryImage,
} from '@/services/gallery';
import type { AdminPackageWithGalleryType } from '@/types/package';

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface GalleryManagerProps {
  packageData: AdminPackageWithGalleryType;
}

export function GalleryManager({ packageData }: GalleryManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const addImageMutation = useAddImageToPackage();

  const deleteMutation = useDeleteImageFromPackage();

  const uploadMutation = useUploadGalleryImage({
    onSuccess: (data) => {
      addImageMutation.mutate({
        packageId: packageData.id,
        imageUrl: data.imageUrl,
        publicId: data.publicId,
      });
      clearSelection();
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const isUploading = uploadMutation.isPending || addImageMutation.isPending;

  function clearSelection() {
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  function applyFile(file: File) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  }

  function handleUpload() {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);
    uploadMutation.mutate(formData);
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='h-px w-6 bg-primary shrink-0' />
        <span className='text-xs font-semibold tracking-[0.15em] uppercase text-primary'>
          Gallery · {packageData.gallery.length} image
          {packageData.gallery.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/** biome-ignore lint/a11y/noStaticElementInteractions: this is fine */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: this is fine */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${
            dragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : selectedFile
                ? 'border-primary/40 bg-primary/3 cursor-default'
                : 'border-border hover:border-primary/40 hover:bg-muted/30'
          }
        `}
      >
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          className='sr-only'
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {selectedFile && preview ? (
          <div className='flex items-center gap-4 p-4'>
            <div className='relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border'>
              <Image
                src={preview}
                alt='Preview'
                fill
                className='object-cover'
              />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold truncate'>
                {selectedFile.name}
              </p>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {(selectedFile.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <div className='flex items-center gap-2 shrink-0'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground hover:text-destructive'
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                disabled={isUploading}
              >
                <X className='w-4 h-4' />
              </Button>
              <Button
                type='button'
                size='sm'
                className='gap-2'
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className='w-3.5 h-3.5 animate-spin' />
                ) : (
                  <UploadCloud className='w-3.5 h-3.5' />
                )}
                {isUploading ? 'Uploading…' : 'Upload'}
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-10 px-4 text-center'>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors
              ${dragging ? 'bg-primary/15' : 'bg-muted'}`}
            >
              <ImagePlus
                className={`w-5 h-5 transition-colors ${dragging ? 'text-primary' : 'text-muted-foreground'}`}
              />
            </div>
            <p className='text-sm font-semibold'>
              {dragging ? 'Drop to upload' : 'Drag & drop or click to select'}
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              PNG, JPG, WEBP — max {MAX_FILE_SIZE_MB}MB
            </p>
          </div>
        )}
      </div>

      {packageData.gallery.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
          {packageData.gallery.map((image, i) => {
            const isThisDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables?.imageId === image.id;

            return (
              <div
                key={image.id}
                className='group relative rounded-xl overflow-hidden border border-border aspect-square animate-in fade-in duration-300'
                style={{
                  animationDelay: `${i * 30}ms`,
                  animationFillMode: 'both',
                }}
              >
                <Image
                  src={image.url}
                  alt=''
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200' />
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='h-8 w-8 shadow-lg'
                    onClick={() =>
                      deleteMutation.mutate({
                        packageId: packageData.id,
                        imageId: image.id,
                      })
                    }
                    disabled={deleteMutation.isPending}
                  >
                    {isThisDeleting ? (
                      <Loader2 className='w-3.5 h-3.5 animate-spin' />
                    ) : (
                      <Trash2 className='w-3.5 h-3.5' />
                    )}
                  </Button>
                </div>
                {isThisDeleting && (
                  <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                    <Loader2 className='w-5 h-5 text-white animate-spin' />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-border text-center'>
          <div className='w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3'>
            <ImagePlus className='w-5 h-5 text-muted-foreground' />
          </div>
          <p className='text-sm font-semibold'>No images yet</p>
          <p className='text-xs text-muted-foreground mt-1'>
            Upload your first image above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
