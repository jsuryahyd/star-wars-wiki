declare const vi: typeof import('vitest')['vi'];
import '@testing-library/jest-dom';
import { server } from '../../mocks/server';

// Workarounds for JSDOM issues (if needed)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that are declared as a part of tests (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

// console.log('Registering snapshot serializer');
//Dynamic classes like css-[hash] are not deterministic, so we need to replace them with a static class name for snapshot testing
//causes out of memory error
// expect.addSnapshotSerializer({
//   test: val => typeof val === 'string',
//   print: (val, serialize) =>
//     serialize((val as string).replace(/class="css-[^"]+"/g, 'class="chakra-class"')),
// });

// // Suppress Testing Library's debug HTML output on test fail -> not working
// const originalError = console.error;
// console.error = (...args) => {
//   // Filter out large HTML dumps (common pattern: contains <body or <div or <html)
//   if (
//     args.length &&
//     typeof args[0] === 'string' &&
//     /<body|<div|<html/i.test(args[0])
//   ) {
//     return;
//   }
//   originalError(...args);
// };