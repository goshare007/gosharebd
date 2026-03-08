import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as Blob | null;

    if (!image) {
      return new NextResponse('Bad Request: No image found in form data', {
        status: 400,
      });
    }

    // 2. Upload image to Cloudinary
    // The UploadImage function is already configured to handle buffer/stream.
    const { secure_url, public_id } = await UploadImage(
      image,
      'package_galleries', // A dedicated folder for package galleries
    );

    if (!secure_url || !public_id) {
      throw new Error('Failed to upload image to Cloudinary.');
    }

    // 3. Return the URL and public_id
    return NextResponse.json({
      imageUrl: secure_url,
      publicId: public_id,
    });
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
