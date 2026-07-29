import { describe, it, expect, vi } from 'vitest';
import { fetchAllPages } from './fetchAllPages.js';

describe('fetchAllPages', () => {
  it('aggregates pages until the server reports no more items', async () => {
    const allItems = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }));
    const fetchPage = vi.fn(({ skip, limit }) => {
      const pageItems = allItems.slice(skip, skip + limit);
      return Promise.resolve({ items: pageItems, total: allItems.length });
    });

    const result = await fetchAllPages({ fetchPage, limit: 2 });

    expect(result.items).toEqual(allItems);
    expect(result.total).toBe(5);
    expect(fetchPage).toHaveBeenCalledTimes(3);
  });

  it('stops once a page returns fewer items than the requested limit', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ items: [{ id: 1 }, { id: 2 }] })
      .mockResolvedValueOnce({ items: [{ id: 3 }] });

    const result = await fetchAllPages({ fetchPage, limit: 2, getTotal: () => undefined });

    expect(result.items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(result.total).toBe(3);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('stops immediately when the first page is empty', async () => {
    const fetchPage = vi.fn().mockResolvedValue({ items: [], total: 0 });

    const result = await fetchAllPages({ fetchPage });

    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it('respects maxPages as a safety cap', async () => {
    const fetchPage = vi.fn().mockResolvedValue({ items: [{ id: 1 }, { id: 2 }] });

    const result = await fetchAllPages({ fetchPage, limit: 2, maxPages: 3 });

    expect(fetchPage).toHaveBeenCalledTimes(3);
    expect(result.items).toHaveLength(6);
  });

  it('supports custom getItems/getTotal extractors', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ data: { rows: [{ id: 1 }], count: 2 } })
      .mockResolvedValueOnce({ data: { rows: [{ id: 2 }], count: 2 } });

    const result = await fetchAllPages({
      fetchPage,
      limit: 1,
      getItems: (response) => response?.data?.rows,
      getTotal: (response) => response?.data?.count,
    });

    expect(result.items).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.total).toBe(2);
  });
});
