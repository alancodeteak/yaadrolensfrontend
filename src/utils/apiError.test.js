import { describe, it, expect } from 'vitest';
import { getApiErrorMessage } from './apiError.js';

describe('getApiErrorMessage', () => {
  it('returns the fallback when there is no error', () => {
    expect(getApiErrorMessage(null)).toBe('Something went wrong. Please try again.');
    expect(getApiErrorMessage(undefined, 'Custom fallback')).toBe('Custom fallback');
  });

  it('returns a string detail directly', () => {
    const err = { data: { detail: 'Employee not found' } };
    expect(getApiErrorMessage(err)).toBe('Employee not found');
  });

  it('joins an array of detail messages', () => {
    const err = {
      data: {
        detail: [{ msg: 'Name is required' }, { message: 'Code is invalid' }],
      },
    };
    expect(getApiErrorMessage(err)).toBe('Name is required; Code is invalid');
  });

  it('humanizes and joins validation_errors entries', () => {
    const err = {
      data: {
        error_data: {
          validation_errors: [
            { field: 'body->employee_name', message: 'is required' },
            { field: 'body->shifts->0', msg: 'is invalid' },
          ],
        },
      },
    };
    expect(getApiErrorMessage(err)).toBe('employee name: is required\nshifts 1: is invalid');
  });

  it('falls back to err.message when present and not the generic "Rejected"', () => {
    const err = { message: 'Network Error' };
    expect(getApiErrorMessage(err)).toBe('Network Error');
  });

  it('ignores the generic RTK Query "Rejected" message and uses the fallback', () => {
    const err = { message: 'Rejected' };
    expect(getApiErrorMessage(err)).toBe('Something went wrong. Please try again.');
  });

  it('still returns a "Request validation failed" detail string as a last resort', () => {
    const err = { data: { detail: 'Request validation failed' }, message: 'Rejected' };
    expect(getApiErrorMessage(err, 'fallback message')).toBe('Request validation failed');
  });
});
