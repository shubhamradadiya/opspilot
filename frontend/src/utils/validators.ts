// ============================================================================
// VALIDATORS UTILITY
// OpsPilot · Phase 12 Polish
// Shared Zod schemas for consistent validation across the app.
// ============================================================================

import { z } from 'zod';

// ============================================================================
// SHARED SCHEMAS
// ============================================================================

/**
 * Required string with custom message
 */
export const requiredString = (message: string = 'This field is required') => 
  z.string().trim().min(1, message);

/**
 * Valid email schema
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email address');

/**
 * Phone number schema (basic)
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/**
 * Currency/Amount schema (positive numbers)
 */
export const amountSchema = z
  .number({
    message: 'Amount is required',
  })
  .positive('Amount must be greater than zero')

  .or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format').transform(Number));


/**
 * Future date schema
 */
export const futureDateSchema = z
  .date()
  .refine((date) => date > new Date(), {
    message: 'Date must be in the future',
  });

/**
 * Past date schema
 */
export const pastDateSchema = z
  .date()
  .refine((date) => date <= new Date(), {
    message: 'Date cannot be in the future',
  });

/**
 * Password schema (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// ============================================================================
// COMMON OBJECT SCHEMAS
// ============================================================================

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  search: z.string().optional(),
  sortKey: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
