import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';


export async function POST(request: NextRequest) {
  try {
    const { prompt, projectId, originalImage } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Missing Gemini API key');
      return NextResponse.json({
        imageUrl: generateFallbackImage(prompt, projectId),
        message: 'Using fallback image generation (Gemini API key not configured)'
      });
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

    try {
      const config = { responseModalities: ['IMAGE', 'TEXT'] };
      const model = 'gemini-2.5-flash-image-preview';
      
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

      const response = await genAI.models.generateContentStream({
        model,
        config,
        contents,
      });

      let generatedImageBase64: string | null = null;
      let generatedMimeType: string | null = null;

      for await (const chunk of response) {
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          generatedImageBase64 = inlineData.data || null;
          generatedMimeType = inlineData.mimeType || 'image/png';
          break;
        }
      }

      if (!generatedImageBase64 || !generatedMimeType) {
        throw new Error('No image data was generated in the response.');
      }

      const imageUrl = `data:${generatedMimeType};base64,${generatedImageBase64}`;

      console.log('Successfully generated image as Data URL.');
      
      return NextResponse.json({
        imageUrl: imageUrl,
        message: `Image generated successfully.`
      });

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      return NextResponse.json({
        imageUrl: generateFallbackImage(prompt, projectId),
        message: 'Using fallback image generation due to Gemini API error.',
        error: 'API_ERROR'
      });
    }

  } catch (error) {
    console.error('Error in image generation endpoint:', error);
    const { prompt, projectId } = await request.json().catch(() => ({ prompt: 'Unknown', projectId: 'unknown' }));
    return NextResponse.json({
      imageUrl: generateFallbackImage(prompt, projectId),
      message: 'Using fallback image generation due to an unexpected server error.'
    });
  }
}

function generateFallbackImage(prompt: string, projectId: string): string {
  const width = 800;
  const height = 450;
  
  const escapeXml = (unsafe: string) => unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });

  const truncatedPrompt = prompt.length > 100 ? prompt.substring(0, 97) + '...' : prompt;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6366F1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="35%" text-anchor="middle" font-family="sans-serif" fill="white" font-size="24" font-weight="bold">AI-Generated Vision</text>
      <text x="50%" y="50%" text-anchor="middle" font-family="sans-serif" fill="white" font-size="16">Project: ${escapeXml(projectId)}</text>
      <text x="50%" y="65%" text-anchor="middle" font-family="sans-serif" fill="white" font-size="14">${escapeXml(truncatedPrompt)}</text>
      <text x="50%" y="80%" text-anchor="middle" font-family="sans-serif" fill="white" font-size="12" opacity="0.8">Configure GEMINI_API_KEY for real AI generation</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
