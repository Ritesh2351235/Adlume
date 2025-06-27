import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function syncUserToDatabase() {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    // Check if user exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { id: clerkUser.id }
    });

    if (existingUser) {
      // Update existing user data if needed
      const updatedUser = await prisma.user.update({
        where: { id: clerkUser.id },
        data: {
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          email: clerkUser.emailAddresses[0]?.emailAddress || null,
        }
      });
      
      return updatedUser;
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          email: clerkUser.emailAddresses[0]?.emailAddress || null,
          credits: 10, // Default credits for new users
        }
      });
      
      return newUser;
    }
  } catch (error) {
    console.error('Error syncing user to database:', error);
    return null;
  }
}

export async function getUserFromDatabase(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      // Try to sync user if not found
      const syncedUser = await syncUserToDatabase();
      return syncedUser?.id === userId ? syncedUser : null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user from database:', error);
    return null;
  }
} 