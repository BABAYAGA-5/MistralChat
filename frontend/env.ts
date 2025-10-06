/**
 * Environment variables configuration for the frontend
 * This file validates and exports environment variables with proper types
 */

/**
 * Environment variables schema
 */
const envSchema = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

/**
 * Validate required environment variables
 */
function validateEnv() {
  const errors: string[] = [];
  
  // Check for required variables
  if (!envSchema.NEXT_PUBLIC_API_BASE_URL) {
    errors.push('NEXT_PUBLIC_API_BASE_URL is required');
  }
  
  if (errors.length > 0) {
    console.error('Environment validation errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Environment validation failed');
  }
}

// Validate environment variables
validateEnv();

/**
 * Validated environment variables
 */
export const env = {
  NEXT_PUBLIC_API_BASE_URL: envSchema.NEXT_PUBLIC_API_BASE_URL as string,
};

// Type definitions for TypeScript
export type Env = typeof env;