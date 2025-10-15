export const formatCurrency = (value, locale = 'vi-VN', currency = 'VND') => {
  const numericValue = Number(value) || 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(numericValue);
  } catch {
    return `${numericValue}`;
  }
};

export const buildPaginationState = (response) => {
  if (!response) {
    return {
      items: [],
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 1
    };
  }

  // Handle API structure: response.data contains items, totalResults, page, pageSize
  const data = response.data ?? response;
  const items = data.items ?? (Array.isArray(data) ? data : []);

  const page = data.page ?? 1;
  const pageSize = data.pageSize ?? 10;
  const totalItems = data.totalResults ?? data.total ?? (Array.isArray(items) ? items.length : 0);
  const totalPages = pageSize ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  return {
    items: Array.isArray(items) ? items : [],
    page,
    pageSize,
    totalItems,
    totalPages
  };
};
