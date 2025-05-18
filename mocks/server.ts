// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// if (process.env.NODE_ENV === 'test') {
//   server.events.on('request:start', (req) => {
//     // You can log or perform actions when an MSW request starts
//     // console.log(`MSW intercepted: ${req.method} ${req.url.href}`);
//   });
//   server.events.on('request:match', (req) => {
//     // You can log or perform actions when an MSW request matches a handler
//     console.log(`MSW matched: ${JSON.stringify(req, null, 2)}`);
//   });
//   server.events.on('request:unhandled', (req) => {
//     // You can log or throw if an unhandled request occurs
//     // console.warn(`MSW unhandled: ${req.method} ${req.url.href}`);
//   });
// }

