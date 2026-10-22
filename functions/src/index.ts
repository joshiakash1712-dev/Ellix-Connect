import type { Request, Response } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { app } from '../../server';

// Express apps accept an optional third `next` argument. When it is omitted
// Express ends the response with its own final handler, which is exactly what
// the Cloud Functions runtime needs.
export const api = onRequest((req, res) => {
  (app as unknown as (request: Request, response: Response) => void)(req, res);
});
