export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
  total?: number;
}

export interface PaginationMeta {
  cursor: string | null;
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
}

export function encodeCursor(value: string | Date | number): string {
  const encoded =
    typeof value === 'object' ? value.toISOString() : String(value);
  return Buffer.from(encoded).toString('base64url');
}

export function decodeCursor(cursor: string): string | Date | number {
  const decoded = Buffer.from(cursor, 'base64url').toString('utf-8');
  const parsedDate = new Date(decoded);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  const parsedNumber = Number(decoded);
  if (!Number.isNaN(parsedNumber)) {
    return parsedNumber;
  }
  return decoded;
}

export function getPaginationParams(
  cursor?: string,
  limit?: number,
  defaultLimit: number = 10,
  maxLimit: number = 100,
): { cursorValue: string | null; take: number; skip: number } {
  const take = Math.min(limit ?? defaultLimit, maxLimit);
  const cursorValue = cursor ? (decodeCursor(cursor) as string) : null;
  const skip = cursorValue ? 1 : 0;

  return { cursorValue, take, skip };
}

export function buildPaginatedResponse<T>(
  data: T[],
  take: number,
  nextCursorValue?: string | null,
): PaginationResult<T> {
  const hasMore = data.length === take;
  const nextCursor =
    hasMore && nextCursorValue ? encodeCursor(nextCursorValue) : undefined;

  return {
    data: data.slice(0, take),
    hasMore,
    nextCursor,
  };
}

export function buildPaginatedResponseWithTotal<T>(
  data: T[],
  take: number,
  total: number,
  nextCursorValue?: string | null,
): PaginationResult<T> {
  const result = buildPaginatedResponse(data, take, nextCursorValue);
  return { ...result, total };
}
