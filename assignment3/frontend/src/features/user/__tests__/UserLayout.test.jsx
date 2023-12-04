import { renderWithRouter, screen, within } from '@test/test-utils';
import { describe, expect, test } from 'vitest';
import UserLayout from '../UserLayout';

describe('<UserLayout />', () => {
  test('Correct visibility', async () => {
    const loader = () => ({
      id: 'bb5cc931-171b-493b-9ffe-f5ee262ed2c5',
      email: 'admin@example.com',
      username: 'admin',
      age: 30,
      createdAt: '2023-12-01T16:39:51.271Z',
    });
    const expectedHeading = 'admin@example.com';
    const expectedNavigationLinks = ['Rides', 'Ride types'];
    const expectedOutletText = 'Rides';
    renderWithRouter(<UserLayout />, {
      loader,
      children: [
        {
          path: '/',
          element: <div>Rides</div>,
        },
      ],
    });

    expect(await screen.findByRole('heading', { name: expectedHeading })).toBeVisible();
    expectedNavigationLinks.forEach((link) => {
      expect(screen.getByRole('link', { name: link })).toBeVisible();
    });
    expect(within(screen.getByRole('main')).getByText(expectedOutletText)).toBeVisible();
  });
});
