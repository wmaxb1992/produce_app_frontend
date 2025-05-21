import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './trpc/app-router';
import { createContext } from './trpc/create-context';

// Create Hono app
const app = new Hono();

// Enable CORS
app.use('/*', cors());

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'API is running',
  });
});

// Handle tRPC requests
app.all('/trpc/*', async (c) => {
  // Extract path from URL
  const url = new URL(c.req.url);
  const path = url.pathname.replace('/trpc', '');

  // Create response headers
  const resHeaders = new Headers();

  try {
    // Handle the tRPC request
    const response = await fetchRequestHandler({
      req: c.req.raw,
      router: appRouter,
      createContext: () => createContext({
        req: c.req.raw,
        resHeaders,
      }),
      // Don't include path here, it's extracted from the request URL
      onError: ({ error }) => {
        console.error('tRPC error:', error);
      },
    });

    // Copy headers from tRPC response to Hono response
    response.headers.forEach((value, key) => {
      c.header(key, value);
    });

    return response;
  } catch (error) {
    console.error('Error handling tRPC request:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export default app;