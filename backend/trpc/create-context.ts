import { inferAsyncReturnType } from '@trpc/server';

// Define the context creation options
interface CreateContextOptions {
  req: Request;
  resHeaders: Headers;
}

/**
 * Creates the context for tRPC procedures
 */
export async function createContext(opts: CreateContextOptions) {
  return {
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;