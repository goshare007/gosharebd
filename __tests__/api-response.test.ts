import { describe, expect, test } from 'bun:test';
import {
  apiError,
  apiSuccess,
  ERROR_CODES,
  getErrorMessage,
  HTTP_STATUS,
  isApiErrorResponse,
  isApiSuccessResponse,
} from '../lib/api-response';

describe('API Response Utilities', () => {
  describe('apiError', () => {
    test('creates error response with default status', () => {
      const response = apiError('Something went wrong');
      expect(response.status).toBe(500);
    });

    test('creates error response with custom status', () => {
      const response = apiError('Not found', 404);
      expect(response.status).toBe(404);
    });

    test('includes error code when provided', async () => {
      const response = apiError('Validation error', 400, 'VALIDATION_ERROR');
      const body = await response.json();
      expect(body.code).toBe('VALIDATION_ERROR');
    });

    test('includes details when provided', async () => {
      const details = { field: 'email', reason: 'invalid format' };
      const response = apiError(
        'Validation error',
        400,
        'VALIDATION_ERROR',
        details,
      );
      const body = await response.json();
      expect(body.details).toEqual(details);
    });
  });

  describe('apiSuccess', () => {
    test('creates success response with default status', () => {
      const response = apiSuccess({ id: '123' });
      expect(response.status).toBe(200);
    });

    test('creates success response with custom status', () => {
      const response = apiSuccess({ id: '123' }, 'Created successfully', 201);
      expect(response.status).toBe(201);
    });

    test('includes message when provided', async () => {
      const response = apiSuccess({ id: '123' }, 'User created');
      const body = await response.json();
      expect(body.message).toBe('User created');
    });
  });

  describe('isApiErrorResponse', () => {
    test('returns true for error response', () => {
      const response = { error: 'Something went wrong' };
      expect(isApiErrorResponse(response)).toBe(true);
    });

    test('returns false for success response', () => {
      const response = { data: { id: '123' } };
      expect(isApiErrorResponse(response)).toBe(false);
    });

    test('returns false for null', () => {
      expect(isApiErrorResponse(null)).toBe(false);
    });

    test('returns false for undefined', () => {
      expect(isApiErrorResponse(undefined)).toBe(false);
    });
  });

  describe('isApiSuccessResponse', () => {
    test('returns true for success response', () => {
      const response = { data: { id: '123' } };
      expect(isApiSuccessResponse(response)).toBe(true);
    });

    test('returns true for success response with message', () => {
      const response = { data: { id: '123' }, message: 'Success' };
      expect(isApiSuccessResponse(response)).toBe(true);
    });

    test('returns false for error response', () => {
      const response = { error: 'Something went wrong' };
      expect(isApiSuccessResponse(response)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    test('extracts message from ApiErrorResponse', () => {
      const response = { error: 'Validation failed' };
      expect(getErrorMessage(response)).toBe('Validation failed');
    });

    test('returns error message from Error instance', () => {
      const error = new Error('Something broke');
      expect(getErrorMessage(error)).toBe('Something broke');
    });

    test('returns default message for unknown format', () => {
      expect(getErrorMessage('string error')).toBe(
        'An unexpected error occurred',
      );
    });
  });

  describe('HTTP_STATUS constants', () => {
    test('has correct status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe('ERROR_CODES constants', () => {
    test('has correct error codes', () => {
      expect(ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ERROR_CODES.NOT_FOUND).toBe('NOT_FOUND');
      expect(ERROR_CODES.DATABASE_ERROR).toBe('DATABASE_ERROR');
    });
  });
});
