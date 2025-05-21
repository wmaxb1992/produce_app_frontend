import { router } from './trpc';
import { hiProcedure } from './routes/example/hi/route';

// Create example router
const exampleRouter = router({
  hi: hiProcedure,
});

// Create the app router
export const appRouter = router({
  example: exampleRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;