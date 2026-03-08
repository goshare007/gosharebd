export interface GalleryItem {
  id: string;
  url: string;
  package: {
    name: string;
    slug: string;
    location: string;
  };
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
