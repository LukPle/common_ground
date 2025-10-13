import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { Database } from '../../../types/supabase';

type NewIdea = Database['public']['Tables']['ideas']['Insert'];

interface SubmitIdeaRequestBody {
  title: string;
  description: string;
  generatedImage: string;
  project_reference: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      generatedImage,
      project_reference,
      user_id
    }: SubmitIdeaRequestBody = await request.json();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error("Server configuration error: Missing Supabase credentials.");
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const base64Data = generatedImage.split(';base64,').pop();
    if (!base64Data) throw new Error("Invalid image data format.");

    const initialBuffer = Buffer.from(base64Data, 'base64');

    console.log(`Optimizing image... Original size: ${Math.round(initialBuffer.length / 1024)} KB`);

    const optimizedBuffer = await sharp(initialBuffer)
      .resize(1280)
      .webp({ quality: 80 })
      .toBuffer();

    console.log(`Optimization complete. New size: ${Math.round(optimizedBuffer.length / 1024)} KB`);

    const fileName = `idea-${project_reference}-${title}-${Date.now()}.webp`;
    const mimeType = 'image/webp';

    const { error: uploadError } = await supabaseAdmin.storage
      .from('generated_images')
      .upload(fileName, optimizedBuffer, { contentType: mimeType, upsert: false });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('generated_images')
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) {
      throw new Error("Could not get public URL for the uploaded image.");
    }
    const publicUrl = urlData.publicUrl;

    const newIdeaForDb: NewIdea = {
      title,
      description,
      generated_image: publicUrl,
      project_reference,
      user_id,
    };

    const { error: insertError } = await supabaseAdmin
      .from('ideas')
      .insert(newIdeaForDb);

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log('Successfully saved idea to database.');
    return NextResponse.json({ message: "Idea submitted successfully!" }, { status: 200 });

  } catch (error: any) {
    console.error('Error in /api/submit-idea:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
