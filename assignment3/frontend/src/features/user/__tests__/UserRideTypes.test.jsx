import { renderWithRouter, screen, within } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import UserRidesTypes from '../UserRideTypes';

describe('<UserRideTypes />', () => {
  test('Correct visibility', async () => {
    const loader = () => [
      {
        id: 'e2293dd1-ab21-425e-94b5-7d8d0374a3bb',
        name: 'Ride type name',
        description: 'Ride type description',
        createdAt: '2023-21-2000T18:13:52.273Z',
      },
      {
        id: '3134392a-37bb-4a6f-86b6-7bdbb117a368',
        name: 'Some name',
        description: 'Some description',
        createdAt: '2023-12-01T18:13:52.273Z',
      },
    ];
    const expectedHeading = 'List of ride types';
    const expectedColumns = ['Name', 'Description', 'Actions'];
    const expectedRows = [
      'Ride type name Ride type description Delete',
      'Some name Some description Delete',
    ];
    const expectedDeleteButtonText = 'Delete';
    const expectedAddRideLinkText = 'Add new ride type';
    renderWithRouter(<UserRidesTypes />, { loader });

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
        name: 'Some name',
        description: 'Some description',
      },
    ];
    const { action, dataSpy } = createRouteAction();
    const expectedData = {
      id: 'e2293dd1-ab21-425e-94b5-7d8d0374a3bb',
    };
    const { user } = renderWithRouter(<UserRidesTypes />, { loader, action });

    await user.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
