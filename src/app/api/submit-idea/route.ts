import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { Database } from '@/types/supabase';

type NewIdea = Database['public']['Tables']['ideas']['Insert'];

const USER_ID_COOKIE = 'anonymous-user-id';

interface SubmitIdeaRequestBody {
  title: string;
  description: string;
  generatedImage: string;
  project_reference: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      description,
      generatedImage,
      project_reference,
    }: SubmitIdeaRequestBody = await request.json();

    const user_id = request.cookies.get(USER_ID_COOKIE)?.value ?? 'anonymous';

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
    const optimizedBuffer = await sharp(initialBuffer)
      .resize(1280)
      .webp({ quality: 80 })
      .toBuffer();

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

    const { data: newIdea, error: insertError } = await supabaseAdmin
      .from('ideas')
      .insert(newIdeaForDb)
      .select('id')
      .single();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    if (!newIdea) {
      throw new Error("Failed to retrieve the new idea's ID after insertion.");
    }

    return NextResponse.json({
      message: "Idea submitted successfully!",
      ideaId: newIdea.id
    }, { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in /api/submit-idea:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
