import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { prompt, projectId, originalImage } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Get Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Missing Gemini API key');
      return NextResponse.json({
        imageUrl: generateFallbackImage(prompt, projectId),
        message: 'Using fallback image generation (Gemini API key not configured)'
      });
    }

    // Initialize Gemini AI client
    const genAI = new GoogleGenAI({ apiKey });

    // Enhanced prompt for architectural/urban planning visualization
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
      // Configure the model with response modalities
      const config = {
        responseModalities: ['IMAGE', 'TEXT'],
      };

      const model = 'gemini-2.5-flash-image-preview';
      
      // Prepare the parts array starting with the image if provided
      const parts: any[] = [];
      
      // Add the original image if provided
      if (originalImage) {
        console.log('Processing original image:', originalImage);
        // Convert image URL to base64 if it's a local path
        let imageData: string = '';
        let mimeType: string = 'image/jpeg';
        
        if (originalImage.startsWith('/')) {
          // It's a local path, we need to read the file
          try {
            const fs = await import('fs/promises');
            const path = await import('path');
            const imagePath = path.join(process.cwd(), 'public', originalImage);
            console.log('Reading image from path:', imagePath);
            
            const imageBuffer = await fs.readFile(imagePath);
            imageData = imageBuffer.toString('base64');
            
            // Detect MIME type from file extension
            const ext = path.extname(originalImage).toLowerCase();
            switch (ext) {
              case '.jpg':
              case '.jpeg':
                mimeType = 'image/jpeg';
                break;
              case '.png':
                mimeType = 'image/png';
                break;
              case '.webp':
                mimeType = 'image/webp';
                break;
              default:
                mimeType = 'image/jpeg';
            }
            
            console.log('Successfully read image, size:', imageBuffer.length, 'bytes, mimeType:', mimeType);
          } catch (fileError) {
            console.error('Could not read original image file:', fileError);
            imageData = '';
          }
        } else if (originalImage.startsWith('data:')) {
          // It's already a data URL
          const [header, data] = originalImage.split(',');
          imageData = data;
          mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
          console.log('Using data URL image, mimeType:', mimeType);
        } else {
          // It's an external URL - we'll skip image input for now
          console.warn('External image URLs not supported for input');
          imageData = '';
        }
        
        if (imageData) {
          console.log('Adding original image to Gemini prompt');
          parts.push({
            inlineData: {
              mimeType,
              data: imageData,
            },
          });
        } else {
          console.warn('No image data available to send to Gemini');
        }
      } else {
        console.log('No original image provided');
      }
      
      // Add the text prompt
      parts.push({
        text: enhancedPrompt,
      });

      const contents = [
        {
          role: 'user',
          parts,
        },
      ];

      console.log('Sending to Gemini:', {
        model,
        partsCount: parts.length,
        hasImage: parts.some(part => part.inlineData),
        hasText: parts.some(part => part.text),
        projectId
      });

      // Generate content using streaming
      const response = await genAI.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fileIndex = 0;
      let savedImagePaths: string[] = [];
      let textResponse = '';

      // Process streaming response
      for await (const chunk of response) {
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
          continue;
        }

        // Handle image data
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const fileName = `generated_image_${projectId}_${Date.now()}_${fileIndex++}`;
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          const fileExtension = mime.getExtension(inlineData.mimeType || 'image/png') || 'png';
          const buffer = Buffer.from(inlineData.data || '', 'base64');
          
          // Save to public/images directory
          const publicDir = path.join(process.cwd(), 'public', 'images');
          const filePath = path.join(publicDir, `${fileName}.${fileExtension}`);
          
          try {
            await writeFile(filePath, buffer);
            const publicPath = `/images/${fileName}.${fileExtension}`;
            savedImagePaths.push(publicPath);
            console.log(`Image saved: ${publicPath}`);
          } catch (saveError) {
            console.error(`Error saving image ${fileName}:`, saveError);
          }
        }
        // Handle text response
        else if (chunk.text) {
          textResponse += chunk.text;
        }
      }

      // Return the first saved image or fallback
      const imageUrl = savedImagePaths.length > 0 
        ? savedImagePaths[0] 
        : null;

      if (!imageUrl) {
        throw new Error('No image generated in response');
      }

      return NextResponse.json({
        imageUrl,
        savedImages: savedImagePaths,
        textResponse,
        prompt: enhancedPrompt,
        projectId,
        message: `Image generated successfully with Gemini API. Saved ${savedImagePaths.length} image(s).`
      });

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      
      // Handle specific quota exceeded errors
      if (geminiError.status === 429 || geminiError.code === 429) {
        const retryAfter = geminiError.message?.includes('30') ? '30 seconds' : 'a few minutes';
        return NextResponse.json({
          imageUrl: generateFallbackImage(prompt, projectId),
          message: `⚠️ Gemini API quota exceeded. This usually means you've hit the free tier limits. Try again in ${retryAfter}, or consider upgrading to a paid plan for unlimited usage.`,
          error: 'QUOTA_EXCEEDED',
          retryAfter
        });
      }
      
      // Handle other API errors
      return NextResponse.json({
        imageUrl: generateFallbackImage(prompt, projectId),
        message: 'Using fallback image generation due to Gemini API error',
        error: 'API_ERROR'
      });
    }

  } catch (error) {
    console.error('Error in image generation:', error);
    
    // Return fallback for any other errors
    const { prompt, projectId } = await request.json().catch(() => ({ prompt: 'Unknown', projectId: 'unknown' }));
    return NextResponse.json({
      imageUrl: generateFallbackImage(prompt, projectId),
      message: 'Using fallback image generation due to unexpected error'
    });
  }
}

// Fallback function for development/demo purposes
function generateFallbackImage(prompt: string, projectId: string): string {
  // Create a simple SVG placeholder with the prompt text
  const width = 800;
  const height = 450;
  
  // Truncate prompt if too long
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
      <text x="50%" y="35%" text-anchor="middle" fill="white" font-size="24" font-weight="bold">AI-Generated Vision</text>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="16">Project: ${projectId}</text>
      <text x="50%" y="65%" text-anchor="middle" fill="white" font-size="14">${truncatedPrompt}</text>
      <text x="50%" y="80%" text-anchor="middle" fill="white" font-size="12" opacity="0.8">Configure GEMINI_API_KEY for real AI generation</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
