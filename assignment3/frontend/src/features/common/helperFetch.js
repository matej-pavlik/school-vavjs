import { getUserToken } from '@/state';

export async function fetchData(url, { method = 'GET', body }) {
  const realUrl = `${import.meta.env.VITE_API_URL}/${url}`;
  const userToken = getUserToken();

  return fetch(realUrl, {
    method,
    headers: {
      ...(userToken ? { Authorization: `Bearer ${getUserToken()}` } : {}),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
}
