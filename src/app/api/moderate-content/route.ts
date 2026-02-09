import { getGeminiApiKey } from '@/lib/env-config';
import { NextRequest, NextResponse } from 'next/server';

const MODERATION_THRESHOLDS = {
    'THREAT': 0.60,
    'SEXUALLY_EXPLICIT': 0.50,
    'IDENTITY_ATTACK': 0.50,
    'SEVERE_TOXICITY': 0.75,
};

const REQUESTED_ATTRIBUTES = Object.fromEntries(
    Object.keys(MODERATION_THRESHOLDS).map(key => [key, {}])
);

export async function POST(request: NextRequest) {
    try {
        const apiKey = getGeminiApiKey();
        const API_ENDPOINT = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`;
        const { title, description } = await request.json();

        if (!title && !description) {
            return NextResponse.json({ isSafe: true }, { status: 200 });
        }

        const textToAnalyze = `${title}. ${description}`;

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment: { text: textToAnalyze },
                languages: ['en'],
                requestedAttributes: REQUESTED_ATTRIBUTES,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Perspective API returned an error:', errorData);
            throw new Error(`Perspective API error: ${errorData.error.message}`);
        }

        const data = await response.json();
        const scores = data.attributeScores;

        if (!scores) {
            console.warn('Perspective API returned a 200 OK but did not include attributeScores.');
            return NextResponse.json({ isSafe: true }, { status: 200 });
        }

        for (const attribute in scores) {
            const score = scores[attribute].summaryScore.value;
            const threshold = MODERATION_THRESHOLDS[attribute as keyof typeof MODERATION_THRESHOLDS];

            if (score > threshold) {
                console.warn(`Content flagged for ${attribute} with score ${score.toFixed(2)} (Threshold: ${threshold})`);
                return NextResponse.json({
                    isSafe: false,
                    reason: `Your idea could not be submitted. The content may have violated our community guidelines regarding "${attribute.toLowerCase().replace(/_/g, ' ')}". Please revise your text and try again.`
                }, { status: 400 });
            }
        }

        return NextResponse.json({ isSafe: true }, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error in moderate-content endpoint:", message);
        return NextResponse.json({
            error: `Content moderation failed: ${message}`
        }, { status: 500 });
    }
}
