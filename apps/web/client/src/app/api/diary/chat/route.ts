import { diaryChatAgent } from '@onlook/introspect';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.text) {
            return NextResponse.json({ error: 'text required' }, { status: 400 });
        }
        const result = await diaryChatAgent({
            text: body.text,
            userId: body.userId,
            conversationId: body.conversationId,
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Diary chat error', error);
        return NextResponse.json({ error: 'internal error' }, { status: 500 });
    }
}
