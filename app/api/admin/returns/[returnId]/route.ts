import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Return from '@/models/Return';
import { triggerReturnApproved, triggerReturnRejected } from '@/lib/emailTriggers';
import mongoose from 'mongoose';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return false;
  }
  return true;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ returnId: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { status, adminNotes, refundAmount } = await req.json();
    const { returnId } = await params;

    if (!status || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await dbConnect();

    const returnRecord = await Return.findById(
      new mongoose.Types.ObjectId(returnId)
    );

    if (!returnRecord) {
      return NextResponse.json(
        { error: 'Return not found' },
        { status: 404 }
      );
    }

    returnRecord.status = status;
    if (adminNotes) {
      returnRecord.adminNotes = adminNotes;
    }
    if (refundAmount !== undefined) {
      returnRecord.refundAmount = refundAmount;
    }

    await returnRecord.save();

    // Trigger email based on status
    if (status === 'approved') {
      await triggerReturnApproved(returnId).catch((err) =>
        console.error('Email failed:', err)
      );
    } else if (status === 'rejected') {
      await triggerReturnRejected(returnId).catch((err) =>
        console.error('Email failed:', err)
      );
    }

    return NextResponse.json({
      success: true,
      message: `Return ${status} successfully`,
    });
  } catch (error) {
    console.error('Update return error:', error);
    return NextResponse.json(
      { error: 'Failed to update return' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ returnId: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { status, adminNotes, refundAmount } = await req.json();
    const { returnId } = await params;

    if (!status || (status !== 'approved' && status !== 'rejected' && status !== 'completed')) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await dbConnect();

    const returnRecord = await Return.findById(
      new mongoose.Types.ObjectId(returnId)
    );

    if (!returnRecord) {
      return NextResponse.json(
        { error: 'Return not found' },
        { status: 404 }
      );
    }

    returnRecord.status = status;
    if (adminNotes !== undefined) {
      returnRecord.adminNotes = adminNotes;
    }
    if (refundAmount !== undefined) {
      returnRecord.refundAmount = refundAmount;
    }

    await returnRecord.save();

    // Trigger email based on status
    if (status === 'approved') {
      await triggerReturnApproved(returnId).catch((err) =>
        console.error('Email failed:', err)
      );
    } else if (status === 'rejected') {
      await triggerReturnRejected(returnId).catch((err) =>
        console.error('Email failed:', err)
      );
    }

    return NextResponse.json({
      success: true,
      message: `Return ${status} successfully`,
    });
  } catch (error) {
    console.error('Update return error:', error);
    return NextResponse.json(
      { error: 'Failed to update return' },
      { status: 500 }
    );
  }
}
