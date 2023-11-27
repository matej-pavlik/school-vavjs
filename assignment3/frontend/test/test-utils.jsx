import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

function customRender(ui, options = {}) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      ...options,
    }),
  };
}

function renderWithRouter(ui, route = {}, options = {}) {
  const router = createMemoryRouter(
    [
      {
        element: ui,
        action: () => null,
        ...route, // route.path is required
      },
    ],
    { initialEntries: [route.path] },
  );

  return customRender(<RouterProvider router={router} />, options);
}

export * from '@testing-library/react';
export { customRender as render, renderWithRouter };
