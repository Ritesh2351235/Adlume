import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (existingUser) {
      // Update existing user data (only name, not email to avoid conflicts)
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.fullName || user.firstName || 'User',
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        user: updatedUser,
        action: 'updated'
      });
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          name: user.fullName || user.firstName || 'User',
          email: user.emailAddresses[0]?.emailAddress || null,
          credits: 10, // Default credits for new users
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        user: newUser,
        action: 'created'
      });
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from our database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      // User doesn't exist, create them
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          name: user.fullName || user.firstName || 'User',
          email: user.emailAddresses[0]?.emailAddress || null,
          credits: 10,
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        user: newUser,
        action: 'created'
      });
    }

    return NextResponse.json({ 
      success: true, 
      user: dbUser,
      action: 'found'
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
} 