import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * Connect to database with exponential backoff retry logic.
 * Increases delay: 1s, 2s, 4s, 8s, 16s, 32s... (2^n * 1000ms)
 * Max 10 attempts = ~17 minutes total wait time
 */
export const connectWithRetry = async (maxAttempts = 10) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await prisma.$connect();
      console.log(`✓ Database connected successfully (attempt ${attempt}/${maxAttempts})`);
      return;
    } catch (error) {
      lastError = error;
      // Exponential backoff: 2^(attempt-1) * 1000ms
      const delayMs = Math.pow(2, attempt - 1) * 1000;
      console.log(
        `✗ Database connection attempt ${attempt}/${maxAttempts} failed. ` +
        `Retrying in ${delayMs}ms: ${error.message}`
      );

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new Error(
    `Failed to connect to database after ${maxAttempts} attempts. ` +
    `Last error: ${lastError?.message}`
  );
};
