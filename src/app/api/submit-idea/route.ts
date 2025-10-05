import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { NewIdea } from '../../../types/idea';

export async function POST(request: NextRequest) {
  try {
    const { title, description, generatedImage, project_reference, user_id }: NewIdea & { generatedImage: string } = await request.json();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase Service Role Key.");
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const base64Data = generatedImage.split(';base64,').pop();
    if (!base64Data) {
      throw new Error("Invalid image data format.");
    }
    
    const fileBuffer = Buffer.from(base64Data, 'base64');
    const mimeType = generatedImage.split(';')[0].split(':')[1];
    const fileExtension = mimeType.split('/')[1] || 'png';
    const fileName = `idea-${project_reference}-${title}-${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('generated_images')
      .upload(fileName, fileBuffer, { contentType: mimeType, upsert: false });

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
      project_reference: project_reference,
      user_id: user_id,
    };

    const { error: insertError } = await supabaseAdmin
      .from('ideas')
      .insert(newIdeaForDb);

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    console.log('Successfully saved idea to database.');

    return NextResponse.json({ message: "Idea submitted successfully!" });

  } catch (error: any) {
    console.error('Error in submit-idea endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
