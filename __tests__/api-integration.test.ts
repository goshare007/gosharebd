import { describe, expect, test } from 'bun:test';
import {
  apiError,
  apiSuccess,
  isApiErrorResponse,
  isApiSuccessResponse,
} from '../lib/api-response';

describe('API Response Integration Tests', () => {
  describe('Full response workflow', () => {
    test('apiError creates a valid error response', async () => {
      const response = apiError('Resource not found', 404, 'NOT_FOUND');

      expect(response.status).toBe(404);

      const body = await response.json();

      expect(isApiErrorResponse(body)).toBe(true);
      expect(body.error).toBe('Resource not found');
      expect(body.code).toBe('NOT_FOUND');
    });

    test('apiSuccess creates a valid success response', async () => {
      const userData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
      };
      const response = apiSuccess(userData, 'User retrieved successfully');

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(isApiSuccessResponse(body)).toBe(true);
      expect(body.data).toEqual(userData);
      expect(body.message).toBe('User retrieved successfully');
    });

    test('error response does not match success response type guard', async () => {
      const response = apiError('Something went wrong', 500);
      const body = await response.json();

      expect(isApiErrorResponse(body)).toBe(true);
      expect(isApiSuccessResponse(body)).toBe(false);
    });

    test('success response does not match error response type guard', async () => {
      const response = apiSuccess({ id: '123' });
      const body = await response.json();

      expect(isApiSuccessResponse(body)).toBe(true);
      expect(isApiErrorResponse(body)).toBe(false);
    });
  });

  describe('Response with details', () => {
    test('error response with validation details', async () => {
      const validationErrors = {
        email: 'Invalid email format',
        password: 'Must be at least 8 characters',
      };

      const response = apiError(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        validationErrors,
      );

      const body = await response.json();

      expect(body.error).toBe('Validation failed');
      expect(body.code).toBe('VALIDATION_ERROR');
      expect(body.details).toEqual(validationErrors);
    });
  });

  describe('Status codes', () => {
    test('returns 201 for resource creation', async () => {
      const newResource = { id: '456', name: 'New Package' };
      const response = apiSuccess(newResource, 'Resource created', 201);

      expect(response.status).toBe(201);
    });

    test('returns 400 for bad request', async () => {
      const response = apiError(
        'Invalid request data',
        400,
        'VALIDATION_ERROR',
      );

      expect(response.status).toBe(400);
    });

    test('returns 401 for unauthorized', async () => {
      const response = apiError('Authentication required', 401, 'UNAUTHORIZED');

      expect(response.status).toBe(401);
    });

    test('returns 500 for server error', async () => {
      const response = apiError('Internal server error', 500, 'INTERNAL_ERROR');

      expect(response.status).toBe(500);
    });
  });
});
