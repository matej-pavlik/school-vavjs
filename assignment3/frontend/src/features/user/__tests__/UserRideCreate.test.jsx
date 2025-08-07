import { renderWithRouter, screen } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import UserRideCreate from '../UserRideCreate';

describe('<UserRideCreate />', () => {
  test('Correct visibility', async () => {
    const loader = () => [];
    const expectedHeading = 'Add new ride';
    const expectedInputLabelTexts = ['Type', 'Date', 'Value', 'Ride type'];
    const expectedCreateButton = 'Add new ride';
    const expectedBackLink = 'Back to rides';
    renderWithRouter(<UserRideCreate />, { loader });

    expect(await screen.findByRole('heading', { name: expectedHeading })).toBeVisible();
    expectedInputLabelTexts.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeVisible();
    });
    expect(screen.getByRole('button', { name: expectedCreateButton })).toBeVisible();
    expect(screen.getByRole('link', { name: expectedBackLink })).toBeVisible();
  });

  test('Correct visibility: select options: type', async () => {
    const loader = () => [];
    const expectedTypeOptions = ['Route', 'Duration', 'Consumption'];
    const { user } = renderWithRouter(<UserRideCreate />, { loader });

    await user.click(await screen.findByLabelText('Type'));

    expectedTypeOptions.forEach((option) => {
      expect(screen.getByRole('option', { name: option })).toBeVisible();
    });
  });

  test('Correct visibility: select options: ride type', async () => {
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
    const expectedRideTypeOptions = ['Ride type name', 'Some name'];
    const { user } = renderWithRouter(<UserRideCreate />, { loader });

    await user.click(await screen.findByLabelText('Ride type'));

    expectedRideTypeOptions.forEach((option) => {
      expect(screen.getByRole('option', { name: option })).toBeVisible();
    });
  });

  test('Correct visibility: errors', async () => {
    const loader = () => [];
    const action = () => ({
      errors: [
        {
          scope: 'REQUEST',
          message: 'Invalid datetime',
          metadata: {
            pathScope: 'BODY',
            path: ['date'],
          },
        },
        {
          scope: 'REQUEST',
          message: 'Number must be greater than or equal to 1',
          metadata: {
            pathScope: 'BODY',
            path: ['value'],
          },
        },
      ],
    });

    /**
     * NOTE: The invalid date value should be more like '90090-12-12', but `<input type="date" />` in happy-dom
     * doesn't take such values, which is different from a browser behavior.
     */
    const invalidDate = '9009-12-12';
    const invalidValue = '-4';
    const expectedDateErrorMessage = 'Invalid datetime';
    const expectedValueErrorMessage = 'Number must be greater than or equal to 1';
    const { user } = renderWithRouter(<UserRideCreate />, { action, loader });

    await user.type(await screen.findByLabelText('Date'), invalidDate);
    await user.type(screen.getByLabelText('Value'), invalidValue);
    await user.click(screen.getByRole('button', { name: 'Add new ride' }));

    expect(screen.getByText(expectedDateErrorMessage)).toBeVisible();
    expect(screen.getByText(expectedValueErrorMessage)).toBeVisible();
  });

  test('Passes correct data to action handler', async () => {
    const loader = () => [
      {
        id: 'e2293dd1-ab21-425e-94b5-7d8d0374a3bb',
        name: 'Ride type name',
        description: 'Ride type description',
        createdAt: '2023-21-2000T18:13:52.273Z',
      },
    ];
    const { action, dataSpy } = createRouteAction();
    const type = 'Route';
    const date = '2020-12-02';
    const value = '400';
    const expectedData = {
      type: 'ROUTE',
      date: '2020-12-02',
      value: '400',
      rideTypeId: 'e2293dd1-ab21-425e-94b5-7d8d0374a3bb',
    };
    const { user } = renderWithRouter(<UserRideCreate />, { action, loader });

    await user.click(await screen.findByLabelText('Type'));
    await user.click(screen.getByRole('option', { name: type }));
    await user.type(screen.getByLabelText('Date'), date);
    await user.type(screen.getByLabelText('Value'), value);
    await user.click(screen.getByLabelText('Ride type'));
    await user.click(screen.getByRole('option', { name: 'Ride type name' }));
    await user.click(screen.getByRole('button', { name: 'Add new ride' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });

  test('Passes correct data to action handler: no ride type', async () => {
    const loader = () => [];
    const { action, dataSpy } = createRouteAction();
    const type = 'Route';
    const date = '2020-12-02';
    const value = '400';
    const expectedData = {
      type: 'ROUTE',
      date: '2020-12-02',
      value: '400',
      rideTypeId: '',
    };
    const { user } = renderWithRouter(<UserRideCreate />, { action, loader });

    await user.click(await screen.findByLabelText('Type'));
    await user.click(screen.getByRole('option', { name: type }));
    await user.type(screen.getByLabelText('Date'), date);
    await user.type(screen.getByLabelText('Value'), value);
    await user.click(screen.getByRole('button', { name: 'Add new ride' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
