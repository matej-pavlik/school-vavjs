import { vi } from 'vitest';

export function createRouteAction() {
  const dataSpy = vi.fn();

  return {
    action: async ({ request }) => {
      const data = Object.fromEntries(await request.formData());
      dataSpy(data);
      return null;
    },
    dataSpy,
  };
}
