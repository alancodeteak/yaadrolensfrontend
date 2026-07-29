/**
 * Generic helper to aggregate a paginated `{ items, total }` API into a single
 * flat list. Many list endpoints in this app cap `limit` server-side (e.g. le=200),
 * so a single request silently truncates once the roster/ledger grows past that
 * cap. This walks pages until everything has been collected.
 *
 * @param {Object} options
 * @param {(pageInfo: { page: number, skip: number, limit: number }) => Promise<any>} options.fetchPage
 *   Called for each page; must return (a promise resolving to) the raw page response.
 * @param {number} [options.limit=100] Page size to request.
 * @param {(response: any) => any[]} [options.getItems] Extracts the items array from a page response.
 * @param {(response: any) => number} [options.getTotal] Extracts the total count from a page response.
 * @param {number} [options.maxPages=500] Safety cap on the number of pages to fetch.
 * @returns {Promise<{ items: any[], total: number }>}
 */
export async function fetchAllPages({
  fetchPage,
  limit = 100,
  getItems = (response) => response?.items ?? [],
  getTotal = (response) => response?.total,
  maxPages = 500,
} = {}) {
  const items = [];
  let total = Infinity;
  let pageIndex = 0;

  while (items.length < total && pageIndex < maxPages) {
    const skip = items.length;
    const page = pageIndex + 1;
    const response = await fetchPage({ page, skip, limit });
    const pageItems = getItems(response) || [];
    const pageTotal = getTotal(response);
    total = pageTotal != null ? pageTotal : pageItems.length === 0 ? items.length : Infinity;

    items.push(...pageItems);
    pageIndex += 1;

    if (pageItems.length === 0 || pageItems.length < limit) {
      break;
    }
  }

  return { items, total: Number.isFinite(total) ? total : items.length };
}

export default fetchAllPages;
