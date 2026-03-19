import { describe, expect, test } from 'bun:test';
import { toSlug } from '../lib/slugify';
import { cn, getInitials } from '../lib/utils';

describe('Utility Functions', () => {
  describe('cn (classnames)', () => {
    test('merges class names', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    test('handles conditional classes', () => {
      const isActive = true;
      const result = cn(
        'base-class',
        isActive && 'active-class',
        !isActive && 'inactive-class',
      );
      expect(result).toBe('base-class active-class');
    });

    test('handles undefined values', () => {
      const result = cn('base-class', undefined, 'other-class');
      expect(result).toBe('base-class other-class');
    });

    test('handles empty strings', () => {
      const result = cn('base-class', '', 'other-class');
      expect(result).toBe('base-class other-class');
    });

    test('handles array input', () => {
      const result = cn(['class1', 'class2']);
      expect(result).toBe('class1 class2');
    });
  });

  describe('getInitials', () => {
    test('returns initials from two words', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    test('returns initials from single word', () => {
      expect(getInitials('John')).toBe('J');
    });

    test('returns initials from multiple words', () => {
      expect(getInitials('John Michael Doe')).toBe('JD');
    });

    test('handles lowercase input', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    test('handles mixed case input', () => {
      expect(getInitials('JoHn dOe')).toBe('JD');
    });

    test('handles empty string', () => {
      expect(getInitials('')).toBe('');
    });

    test('handles whitespace only', () => {
      expect(getInitials(null)).toBe('');
    });
  });

  describe('toSlug', () => {
    test('converts text to lowercase slug', () => {
      expect(toSlug('Hello World')).toBe('hello-world');
    });

    test('replaces spaces with hyphens', () => {
      expect(toSlug('hello world test')).toBe('hello-world-test');
    });

    test('removes special characters', () => {
      expect(toSlug('Hello! World')).toBe('hello-world');
    });

    test('handles unicode characters', () => {
      expect(toSlug('Bangladesh Travel')).toBe('bangladesh-travel');
    });

    test('handles multiple spaces', () => {
      expect(toSlug('hello   world')).toBe('hello-world');
    });

    test('removes leading and trailing hyphens', () => {
      expect(toSlug('  hello world  ')).toBe('hello-world');
    });
  });
});
