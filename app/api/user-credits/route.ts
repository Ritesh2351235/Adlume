import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { credits, action, source, promoCode } = body;

    if (!credits || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: credits, action' },
        { status: 400 }
      );
    }

    // Check if promo code has already been used by this user
    if (promoCode) {
      const existingPromoUsage = await prisma.promoCodeUsage.findFirst({
        where: {
          userId: user.id,
          promoCode: promoCode,
        },
      });

      if (existingPromoUsage) {
        return NextResponse.json(
          { error: 'Promo code has already been used' },
          { status: 400 }
        );
      }
    }

    // Get or create user
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          name: user.fullName || user.firstName || 'User',
          email: user.emailAddresses[0]?.emailAddress || `${user.id}@temp.local`,
          credits: 10,
        },
      });
    }

    // Update credits based on action
    let newCredits = dbUser.credits;
    if (action === 'add') {
      newCredits += credits;
    } else if (action === 'subtract') {
      newCredits = Math.max(0, newCredits - credits);
    }

    // Update user credits
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { credits: newCredits },
    });

    // Record promo code usage if applicable
    if (promoCode && action === 'add') {
      await prisma.promoCodeUsage.create({
        data: {
          userId: user.id,
          promoCode: promoCode,
          creditsAdded: credits,
          source: source || 'promo_code',
        },
      });
    }

    return NextResponse.json({
      success: true,
      credits: updatedUser.credits,
      message: `Successfully ${action === 'add' ? 'added' : 'subtracted'} ${credits} credits`,
    });

  } catch (error) {
    console.error('Error updating user credits:', error);
    return NextResponse.json(
      { error: 'Failed to update user credits' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    // Get user credits from our database (fast query)
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        name: true,
      }
    });

    // If user doesn't exist, create them quickly
    if (!user) {
      const clerkUser = await currentUser();

      if (!clerkUser || clerkUser.id !== userId) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Create user with default credits (use unique email or null)
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@temp.local`,
          credits: 10,
        },
        select: {
          credits: true,
          name: true,
        }
      });

      user = newUser;
    }

    return NextResponse.json({
      success: true,
      credits: user.credits,
      name: user.name
    });

  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user credits' },
      { status: 500 }
    );
  }
} 