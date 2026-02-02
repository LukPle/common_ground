import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FATAL: GEMINI_API_KEY environment variable is not set.");
}

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      throw new Error("Server is missing GEMINI_API_KEY configuration.");
    }

    const { prompt, originalImage } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const genAI = new GoogleGenAI({ apiKey });

    const enhancedPrompt = `I have provided you with an original architectural/urban design image as reference. Please create an enhanced version that incorporates these specific improvements: ${prompt}

    CRITICAL INSTRUCTIONS:
    - STUDY the provided original image carefully and use it as your primary reference
    - MAINTAIN the exact same viewpoint, perspective, and composition as the original
    - PRESERVE all existing architectural elements, buildings, and landscape features
    - SEAMLESSLY INTEGRATE the new enhancements while keeping the original design intact
    - The result should look like a natural evolution of the original, not a completely new design
    - Keep the same lighting conditions, time of day, and overall atmosphere
    - Add the requested improvements (${prompt}) in a way that complements the existing design
    - Ensure photorealistic quality with proper scale, materials, and environmental context
    - Include people for scale and add detailed textures where appropriate
    
    Remember: This is an ENHANCEMENT of the provided image, not a new creation from scratch.`;

    const model = 'gemini-3-pro-image-preview';

    const parts: any[] = [];

    if (originalImage) {
      const imageUrl = originalImage.startsWith('/')
        ? new URL(originalImage, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
        : new URL(originalImage);

      console.log(`Fetching original image from: ${imageUrl}`);
      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch original image: ${imageResponse.statusText}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const imageData = Buffer.from(imageBuffer).toString('base64');
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

      parts.push({ inlineData: { mimeType, data: imageData } });
    }

    parts.push({ text: enhancedPrompt });

    const contents = [{ role: 'user', parts }];

    console.log('Sending request to Gemini...');

    const responseStream = await genAI.models.generateContentStream({
      model,
      contents,
    });

    let generatedImageBase64: string | null = null;
    let generatedMimeType: string | null = null;

    for await (const chunk of responseStream) {
      const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (inlineData) {
        generatedImageBase64 = inlineData.data || null;
        generatedMimeType = inlineData.mimeType || 'image/png';
        break;
      }
    }

    if (!generatedImageBase64 || !generatedMimeType) {
      throw new Error('No image data was generated in the response, possibly due to safety settings or a server timeout.');
    }

    const imageUrl = `data:${generatedMimeType};base64,${generatedImageBase64}`;

    console.log('Successfully generated image as Data URL.');

    return NextResponse.json({
      imageUrl: imageUrl,
      message: `Image generated successfully.`
    });

  } catch (error: any) {
    console.error('Error in image generation endpoint:', error.message);

    return NextResponse.json({
      message: `Image generation failed: ${error.message}`,
      error: 'API_ERROR'
    }, { status: 500 });
  }
}
