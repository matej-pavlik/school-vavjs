import { getUserToken } from '@/state';

export async function fetchData(url, { method = 'GET', body } = {}) {
  const relativeUrl = `/${url}`;
  const userToken = getUserToken();

  return fetch(relativeUrl, {
    method,
    headers: {
      ...(userToken ? { Authorization: `Bearer ${getUserToken()}` } : {}),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
}
