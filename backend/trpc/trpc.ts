import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './create-context';

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;

// Middleware to check if user is authenticated
const isAuthed = t.middleware(({ next }) => {
  // In a real app, you would check if the user is authenticated
  // For now, we'll just pass through
  return next({
    ctx: {
      // Add user info to context if needed
    },
  });
});

// Protected procedure - requires authentication
export const protectedProcedure = t.procedure.use(isAuthed);