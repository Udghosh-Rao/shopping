import { NextRequest, NextResponse } from 'next/server';
import { triggerOrderConfirmation } from '@/lib/emailTriggers';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const result = await triggerOrderConfirmation(orderId);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: (result as any).id,
    });
  } catch (error) {
    console.error('Send order confirmation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
