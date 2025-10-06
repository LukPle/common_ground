import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt } = body;

  try {
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const genAI = new GoogleGenAI({ apiKey });

    const suggestionPrompt = `Analyze the user's idea and generate a creative title and a concise description.

    User's Idea: "${prompt}"

    Your entire response MUST be a single JSON object inside a markdown code block.
    The JSON object must have two string keys: "title" and "description".

    The title should be max. 5 words.
    The description should be around 1-4 sentences, quickly summarizing the idea in understandable words from the perspective of telling someone else what the idea is about.
    
    Example response:
    \`\`\`json
    {
      "title": "A Creative Title Here",
      "description": "A summary of the enhancement."
    }
    \`\`\`
    `;

    const model = 'gemini-2.5-flash-image-preview';
    const contents = [{ role: 'user', parts: [{ text: suggestionPrompt }] }];

    const result = await genAI.models.generateContent({
      model,
      contents,
    });
    // -------------------------
    
    const response = result.candidates;
    const rawText = response?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("AI did not return any text content.");
    }

    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawText;
    
    const parsedSuggestions = JSON.parse(jsonString);

    if (!parsedSuggestions.title || !parsedSuggestions.description) {
      throw new Error("AI failed to generate a valid title and description in the expected JSON format.");
    }

    return NextResponse.json({
      suggestedTitle: parsedSuggestions.title,
      suggestedDescription: parsedSuggestions.description,
    });

  } catch (error: any) {
    console.error("Error in suggest-details endpoint:", error.message);
    return NextResponse.json({ 
        suggestedTitle: 'Museum, Playground, Plaza, ...', 
        suggestedDescription: prompt, 
        error: `Failed to generate suggestions: ${error.message}` 
    }, { status: 500 });
  }
}
