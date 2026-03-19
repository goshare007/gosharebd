import { type NextRequest, NextResponse } from 'next/server';

export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export function apiError(
  message: string,
  status: number = 500,
  code?: string,
  details?: unknown,
) {
  const body: Record<string, unknown> = {
    error: message,
  };
  if (code) body.code = code;
  if (details) body.details = details;
  return NextResponse.json(body, { status });
}

export function apiSuccess<T>(data: T, message?: string, status: number = 200) {
  const body: Record<string, unknown> = { data };
  if (message) body.message = message;
  return NextResponse.json(body, { status });
}

export function isApiErrorResponse(
  response: unknown,
): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as ApiErrorResponse).error === 'string'
  );
}

export function isApiSuccessResponse<T>(
  response: unknown,
): response is ApiSuccessResponse<T> {
  return (
    typeof response === 'object' && response !== null && 'data' in response
  );
}

export function getErrorMessage(response: unknown): string {
  if (isApiErrorResponse(response)) {
    return response.error;
  }
  if (isApiSuccessResponse(response)) {
    return 'Unexpected success response format';
  }
  if (response instanceof Error) {
    return response.message;
  }
  return 'An unexpected error occurred';
}

export function handleApiError(error: unknown, _request: NextRequest) {
  // biome-ignore lint/suspicious/noConsole: this is for error logging
  console.error('API Error:', error);

  if (error instanceof SyntaxError && 'body' in error) {
    return apiError('Invalid JSON in request body', 400, 'INVALID_JSON');
  }

  if (error instanceof Error) {
    if (
      error.message.includes('prisma') ||
      error.message.includes('database')
    ) {
      return apiError('Database error occurred', 500, 'DATABASE_ERROR');
    }

    if (
      error.message.includes('unauthorized') ||
      error.message.includes('unauthenticated')
    ) {
      return apiError('Unauthorized access', 401, 'UNAUTHORIZED');
    }

    if (
      error.message.includes('not found') ||
      error.message.includes('does not exist')
    ) {
      return apiError('Resource not found', 404, 'NOT_FOUND');
    }

    return apiError(
      error.message || 'An unexpected error occurred',
      500,
      'INTERNAL_ERROR',
    );
  }

  return apiError('An unexpected error occurred', 500, 'INTERNAL_ERROR');
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_JSON: 'INVALID_JSON',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
