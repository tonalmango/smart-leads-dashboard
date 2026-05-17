import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

type RequestPart = 'body' | 'query' | 'params';

/**
 * Reusable Zod validation middleware factory.
 * Validates request[part] against the given Zod schema.
 * On failure, returns 400 with a clear, joined error message.
 */
export const validate =
  (schema: AnyZodObject, part: RequestPart = 'body'): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const message = formatZodErrors(result.error);
      sendError(res, message, 400, 'Validation failed');
      return;
    }

    // Replace with parsed + coerced data
    if (part === 'body') req.body = result.data;
    else if (part === 'query') req.query = result.data as Request['query'];
    else if (part === 'params') req.params = result.data as Request['params'];

    next();
  };

function formatZodErrors(error: ZodError): string {
  return error.errors
    .map((e) => {
      const field = e.path.length > 0 ? `${e.path.join('.')}: ` : '';
      return `${field}${e.message}`;
    })
    .join(', ');
}
