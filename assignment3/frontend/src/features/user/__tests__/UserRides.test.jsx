import { renderWithRouter, screen, within } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import UserRides from '../UserRides';

describe('<UserRides />', () => {
  test('Correct visibility', async () => {
    const loader = () => [
      {
        id: 'e2293dd1-ab21-425e-94b5-7d8d0374a3bb',
        createdAt: '2023-12-01T18:13:41.784Z',
        date: '2000-02-21T23:00:00.000Z',
        type: 'ROUTE',
        value: '40',
        rideType: {
          id: '2583cf57-6d1b-465e-8091-c164751cb9c7',
          createdAt: '2023-12-04T03:50:42.468Z',
          name: 'ride name',
          description: 'ride type description',
        },
      },
      {
        id: '3134392a-37bb-4a6f-86b6-7bdbb117a368',
        createdAt: '2023-12-01T18:13:52.273Z',
        date: '2023-12-25T23:00:00.000Z',
        type: 'CONSUMPTION',
        value: '1',
      },
    ];
    const expectedHeading = 'List of rides';
    const expectedColumns = ['Date', 'Type', 'Value', 'Ride type', 'Actions'];
    const expectedRows = [
      '21.02.2000 Route 40 ride name Delete',
      '25.12.2023 Consumption 1 N/A Delete',
    ];
    const expectedDeleteButtonText = 'Delete';
    const expectedAddRideLinkText = 'Add new ride';
    renderWithRouter(<UserRides />, { loader });

    expect(await screen.findByRole('heading', { name: expectedHeading })).toBeVisible();
    expectedColumns.forEach((column) => {
      expect(screen.getByRole('columnheader', { name: column })).toBeVisible();
    });
    expectedRows.forEach((expectedRow) => {
      const row = screen.getByRole('row', { name: expectedRow });
      expect(screen.getByRole('row', { name: expectedRow })).toBeVisible();
      expect(within(row).getByRole('button', { name: expectedDeleteButtonText })).toBeVisible();
    });
    expect(screen.getByRole('link', { name: expectedAddRideLinkText })).toBeVisible();
  });

  test('Triggers route action on delete', async () => {
    const loader = () => [
      {
        id: 'e2293dd1-ab21-425e-94b5-7d8d0374a3bb',
        createdAt: '2023-12-01T18:13:41.784Z',
        date: '2000-02-21T23:00:00.000Z',
        type: 'ROUTE',
        value: '40',
      },
    ];
    const { action, dataSpy } = createRouteAction();
    const expectedData = {
      id: 'e2293dd1-ab21-425e-94b5-7d8d0374a3bb',
    };
    const { user } = renderWithRouter(<UserRides />, { loader, action });

    await user.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
