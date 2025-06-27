import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object to prevent
// multiple instances during hot reloading in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;