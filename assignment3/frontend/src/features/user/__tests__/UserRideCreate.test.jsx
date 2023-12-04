import { renderWithRouter, screen } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import UserRideCreate from '../UserRideCreate';

describe('<UserRideCreate />', () => {
  test('Correct visibility', async () => {
    const expectedHeading = 'Add new ride';
    const expectedInputLabelTexts = ['Type', 'Date', 'Value'];
    const expectedCreateButton = 'Add new ride';
    const expectedBackLink = 'Back to rides';
    renderWithRouter(<UserRideCreate />);

    expect(await screen.findByRole('heading', { name: expectedHeading })).toBeVisible();
    expectedInputLabelTexts.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeVisible();
    });
    expect(screen.getByRole('button', { name: expectedCreateButton })).toBeVisible();
    expect(screen.getByRole('link', { name: expectedBackLink })).toBeVisible();
  });

  test('Correct visibility: select options', async () => {
    const expectedOptions = ['Route', 'Duration', 'Consumption'];
    const { user } = renderWithRouter(<UserRideCreate />);

    await user.click(await screen.findByLabelText('Type'));

    expectedOptions.forEach((option) => {
      expect(screen.getByRole('option', { name: option })).toBeVisible();
    });
  });

  test('Correct visibility: errors', async () => {
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
    const invalidDate = '90090-12-12';
    const invalidValue = '-4';
    const expectedDateErrorMessage = 'Invalid datetime';
    const expectedValueErrorMessage = 'Number must be greater than or equal to 1';
    const { user } = renderWithRouter(<UserRideCreate />, { action });

    await user.type(screen.getByLabelText('Date'), invalidDate);
    await user.type(screen.getByLabelText('Value'), invalidValue);
    await user.click(screen.getByRole('button', { name: 'Add new ride' }));

    expect(screen.getByText(expectedDateErrorMessage)).toBeVisible();
    expect(screen.getByText(expectedValueErrorMessage)).toBeVisible();
  });

  test('Passes correct data to action handler', async () => {
    const { action, dataSpy } = createRouteAction();
    const type = 'Route';
    const date = '2020-12-02';
    const value = '400';
    const expectedData = {
      type: 'ROUTE',
      date: '2020-12-02',
      value: '400',
    };
    const { user } = renderWithRouter(<UserRideCreate />, { action });

    await user.click(await screen.findByLabelText('Type'));
    await user.click(screen.getByRole('option', { name: type }));
    await user.type(screen.getByLabelText('Date'), date);
    await user.type(screen.getByLabelText('Value'), value);
    await user.click(screen.getByRole('button', { name: 'Add new ride' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
