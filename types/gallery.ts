export interface GalleryItem {
  packageId: string;
  packageName: string;
  Location: string;
  thumbnail: {
    id: string;
    url: string;
    publicId: string;
    createdAt: string;
  };
  imageCount: number;
}

export interface SinglePackageImages {
  package: {
    name: string;
    tags: string[];
    Location: string;
    summary: string;
  };
  images: [
    {
      id: string;
      url: string;
      publicId: string;
      createdAt: string;
    },
  ];
  total: number;
}
