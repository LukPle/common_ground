import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("FATAL: GEMINI_API_KEY environment variable is not set.");
}

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      throw new Error("Server is missing GEMINI_API_KEY configuration.");
    }

    const { prompt, limitations, projectTitle, projectDescription } = await request.json();

    if (!prompt || !limitations || !Array.isArray(limitations) || !projectTitle || !projectDescription) {
      return NextResponse.json({ error: 'Prompt, limitations, projectTitle, and projectDescription are required' }, { status: 400 });
    }
    
    const genAI = new GoogleGenAI({ apiKey }); 

    const combinedAnalysisPrompt = `You are an AI assistant for a civic engagement platform focused on real-world urban planning. The user's ideas are proposals for PHYSICAL changes to a location like a park, building, or public space.
    
    Here is the context for the project of the physical space the user is submitting an idea for:
    - Project Title: "${projectTitle}"
    - Project Description: "${projectDescription}"

    Perform the following two tasks based on the user's idea and the project limitations:
    1.  For EACH project limitation, analyze if the user's idea complies with it.
    2.  Generate a suitable title and a concise description for the idea.

    User's Idea: "${prompt}"

    Project Limitations:
    ${limitations.map(l => `- ${l}`).join('\n')}

    Your entire response MUST be a single JSON object inside a markdown code block.
    The JSON object must have three top-level keys: "title", "description", and "realityCheck".

    - "title": A string, maximum 5 words acting as a simple way to name the idea for the project.
    - "description": A string, 1-3 sentences summarizing the idea, from the perspective of someone using the platform to submit their idea and convinve others.
    - "realityCheck": An array of objects. Each object must have "limitation" (string), "status" (string), and "reasoning" (string, 1-2 sentences).

    The "status" in the "realityCheck" must be one of three exact strings:
    1. "Check": The idea clearly complies with the limitation.
    2. "Depending": It's unclear or could potentially conflict with the limitation; it requires human review.
    3. "Violation": The idea almost certainly violates the limitation.

    The "reasoning" in the "realityCheck" must be a concise, 1-2 sentence explanation for your status choice, written in simple terms.

    Example response format:
    \`\`\`json
    {
      "title": "A Creative Title Here",
      "description": "A summary of the enhancement.",
      "realityCheck": [
        { 
          "limitation": "Must not exceed a budget of $100,000.", 
          "status": "Depending",
          "reasoning": "The idea of a 'large water feature' could have significant costs. A detailed budget would be needed to confirm compliance."
        }
      ]
    }
    \`\`\`
    `;

    const model = 'gemini-2.5-flash-lite';
    const contents = [{ role: 'user', parts: [{ text: combinedAnalysisPrompt }] }];

    const result = await genAI.models.generateContent({
      model,
      contents,
    });
    
    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("AI did not return any text content for the analysis.");
    }

    const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawText.trim();
    
    const parsedData = JSON.parse(jsonString);

    if (!parsedData.title || !parsedData.description || !parsedData.realityCheck) {
      throw new Error("AI failed to return all required fields in the JSON object.");
    }

    return NextResponse.json({
      suggestedTitle: parsedData.title,
      suggestedDescription: parsedData.description,
      realityCheckResults: parsedData.realityCheck,
    });

  } catch (error: any) {
    console.error("Error in analyze-idea endpoint:", error.message);
    
    const body = await request.json().catch(() => ({ prompt: '', limitations: [] }));
    
    const fallbackResults = body.limitations.map((limitation: string) => ({
      limitation,
      status: 'Depending',
      reasoning: 'The AI analysis could not be completed. Please review this limitation manually.'
    }));

    return NextResponse.json({ 
      suggestedTitle: 'A New Vision',
      suggestedDescription: body.prompt,
      realityCheckResults: fallbackResults,
      error: `Failed to analyze idea: ${error.message}` 
    }, { status: 500 });
  }
}
