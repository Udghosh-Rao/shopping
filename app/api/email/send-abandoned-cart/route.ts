import { NextRequest, NextResponse } from 'next/server';
import { triggerAbandonedCartEmails } from '@/lib/emailTriggers';

export async function POST(req: NextRequest) {
  try {
    const { hoursAgo } = await req.json();

    const result = await triggerAbandonedCartEmails(hoursAgo || 24);

    return NextResponse.json({
      sent: result.sent,
      failed: result.failed,
    });
  } catch (error) {
    console.error('Send abandoned cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
