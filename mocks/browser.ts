// mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Start the worker. This will intercept all outgoing requests.
worker.start();