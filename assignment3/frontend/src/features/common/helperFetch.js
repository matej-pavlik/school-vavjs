export async function fetchData(url, { method = 'GET', body }) {
  const realUrl = `${import.meta.env.VITE_API_URL}/${url}`;

  return fetch(realUrl, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
  });
}
