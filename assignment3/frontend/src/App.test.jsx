import { describe, expect, test } from 'vitest';
import { render, screen } from '../test/test-utils';
import App from './App';

describe('<App />', () => {
  test('Counter', async () => {
    const expectedInitial = 'Count: 0';
    const expectedAfterClick = 'Count: 1';
    const { user } = render(<App />);

    expect(screen.getByText(expectedInitial)).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(screen.getByText(expectedAfterClick)).toBeVisible();
  });
});
