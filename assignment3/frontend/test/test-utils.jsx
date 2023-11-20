import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function RootProvider({ children }) {
  return children;
}

const customRender = (ui, options) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: RootProvider, ...options }),
});

export * from '@testing-library/react';
export { customRender as render };
