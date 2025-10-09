import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { prompt, limitations } = body;

  try {
    if (!prompt || !limitations || !Array.isArray(limitations)) {
      return NextResponse.json({ error: 'Prompt and limitations array are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const genAI = new GoogleGenAI({ apiKey });

    const realityCheckPrompt = `You are an AI assistant for a civic engagement platform. Your task is to analyze a user's idea against a list of project limitations.

    User's Idea: "${prompt}"

    Project Limitations:
    ${limitations.map(l => `- ${l}`).join('\n')}

    For EACH limitation, determine if the user's idea complies. Your response MUST be a single JSON object with a key "results" which is an array. Each object in the array must have two string keys: "limitation" (the original limitation text) and "status".

    The "status" must be one of three exact strings:
    1. "Check": The idea clearly complies with the limitation.
    2. "Depending": It's unclear or could potentially conflict with the limitation; it requires human review.
    3. "Violation": The idea almost certainly violates the limitation.

    Example response format:
    \`\`\`json
    {
      "results": [
        { "limitation": "Must not exceed a budget of $100,000.", "status": "Depending" },
        { "limitation": "Must use sustainable materials.", "status": "Check" }
      ]
    }
    \`\`\`
    `;

    const model = 'gemini-2.5-flash-image-preview';
    const contents = [{ role: 'user', parts: [{ text: realityCheckPrompt }] }];

    const result = await genAI.models.generateContent({
      model,
      contents,
    });
    
    const response = result.candidates;
    const rawText = response?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("AI did not return any text content for the reality check.");
    }

    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawText;
    
    const parsedResults = JSON.parse(jsonString);

    if (!parsedResults.results || !Array.isArray(parsedResults.results)) {
      throw new Error("AI failed to generate a valid 'results' array.");
    }

    return NextResponse.json(parsedResults);

  } catch (error: any) {
    console.error("Error in reality-check endpoint:", error.message);
    const fallbackResults = limitations.map((limitation: string) => ({
      limitation,
      status: 'Depending'
    }));

    return NextResponse.json({ 
      results: fallbackResults,
      error: `Failed to generate reality check: ${error.message}` 
    }, { status: 500 });
  }
}
