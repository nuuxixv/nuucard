
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, token } = body;

        if (!content || !token) {
            return NextResponse.json(
                { error: 'Missing content or token' },
                { status: 400 }
            );
        }

        // 1. Turnstile 토큰 검증
        const verifyRes = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    secret: TURNSTILE_SECRET_KEY,
                    response: token,
                }),
            }
        );

        const verifyData = await verifyRes.json();

        if (!verifyData.success) {
            console.error('Turnstile verification failed:', verifyData);
            return NextResponse.json(
                { error: 'Invalid captcha token' },
                { status: 403 }
            );
        }

        // 2. Supabase 저장
        const { data, error } = await supabase
            .from('letters')
            .insert([{ content }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to save letter' },
                { status: 500 }
            );
        }

        return NextResponse.json({ id: data.id });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
