import { renderWithRouter, screen } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import UserRideTypeCreate from '../UserRideTypeCreate';

describe('<UserRideTypeCreate />', () => {
  test('Correct visibility', async () => {
    const expectedHeading = 'Add new ride type';
    const expectedInputLabelTexts = ['Name', 'Description'];
    const expectedCreateButton = 'Add new ride type';
    const expectedBackLink = 'Back to ride types';
    renderWithRouter(<UserRideTypeCreate />);

    expect(await screen.findByRole('heading', { name: expectedHeading })).toBeVisible();
    expectedInputLabelTexts.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeVisible();
    });
    expect(screen.getByRole('button', { name: expectedCreateButton })).toBeVisible();
    expect(screen.getByRole('link', { name: expectedBackLink })).toBeVisible();
  });

  test('Correct visibility: errors', async () => {
    const action = () => ({
      errors: [
        {
          scope: 'REQUEST',
          message: 'String must contain at most 30 character(s)',
          metadata: {
            pathScope: 'BODY',
            path: ['name'],
          },
        },
        {
          scope: 'REQUEST',
          message: 'String must contain at most 255 character(s)',
          metadata: {
            pathScope: 'BODY',
            path: ['description'],
          },
        },
      ],
    });
    const invalidName = 'a'.repeat(31);
    const invalidDescription = 'a'.repeat(256);
    const expectedNameErrorMessage = 'String must contain at most 30 character(s)';
    const expectedDescriptionErrorMessage = 'String must contain at most 255 character(s)';
    const { user } = renderWithRouter(<UserRideTypeCreate />, { action });

    await user.type(screen.getByLabelText('Name'), invalidName);
    await user.type(screen.getByLabelText('Description'), invalidDescription);
    await user.click(screen.getByRole('button', { name: 'Add new ride type' }));

    expect(screen.getByText(expectedNameErrorMessage)).toBeVisible();
    expect(screen.getByText(expectedDescriptionErrorMessage)).toBeVisible();
  });

  test('Passes correct data to action handler', async () => {
    const { action, dataSpy } = createRouteAction();
    const name = 'Example name';
    const description = 'Example description';
    const expectedData = {
      name: 'Example name',
      description: 'Example description',
    };
    const { user } = renderWithRouter(<UserRideTypeCreate />, { action });

    await user.type(screen.getByLabelText('Name'), name);
    await user.type(screen.getByLabelText('Description'), description);
    await user.click(screen.getByRole('button', { name: 'Add new ride type' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
