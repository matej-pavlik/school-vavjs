import { renderWithRouter, screen } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import Register from '../Register';

describe('<Register />', () => {
  test('Correct visibility', async () => {
    const expectedHeading = 'Register';
    const expectedEmailLabel = 'Email';
    const expectedUsernameLabel = 'Username';
    const expectedPasswordLabel = 'Password';
    const expectedAgeLabel = 'Age';
    const expectedRegisterButtonText = 'Register';
    const expectedNonMemberText = 'Already a member?';
    const expectedLoginLinkText = 'Log in';
    renderWithRouter(<Register />);

    expect(screen.getByRole('heading', { name: expectedHeading })).toBeVisible();
    expect(screen.getByLabelText(expectedEmailLabel)).toBeVisible();
    expect(screen.getByLabelText(expectedUsernameLabel)).toBeVisible();
    expect(screen.getByLabelText(expectedPasswordLabel)).toBeVisible();
    expect(screen.getByLabelText(expectedAgeLabel)).toBeVisible();
    expect(screen.getByRole('button', { name: expectedRegisterButtonText })).toBeVisible();
    expect(screen.getByText(expectedNonMemberText)).toBeVisible();
    expect(screen.getByRole('link', { name: expectedLoginLinkText })).toBeVisible();
  });

  test('Correct visibility: failed register', async () => {
    const action = () => ({
      errors: [
        {
          scope: 'REQUEST',
          message: 'Invalid email',
          metadata: {
            pathScope: 'BODY',
            path: ['email'],
          },
        },
        {
          scope: 'REQUEST',
          message: 'String must contain at least 2 character(s)',
          metadata: {
            pathScope: 'BODY',
            path: ['username'],
          },
        },
        {
          scope: 'REQUEST',
          message: 'String must contain at least 5 character(s)',
          metadata: {
            pathScope: 'BODY',
            path: ['password'],
          },
        },
        {
          scope: 'REQUEST',
          message: 'Number must be greater than or equal to 1',
          metadata: {
            pathScope: 'BODY',
            path: ['age'],
          },
        },
      ],
    });
    const invalidEmail = 'onecharacterdomain@s.s';
    const invalidUsername = 'a';
    const invalidPassword = 'a';
    const invalidAge = '-14';
    const expectedEmailErrorMessage = 'Invalid email';
    const expectedUsernameErrorMessage = 'String must contain at least 2 character(s)';
    const expectedPasswordErrorMessage = 'String must contain at least 5 character(s)';
    const expectedAgeErrorMessage = 'Number must be greater than or equal to 1';
    const { user } = renderWithRouter(<Register />, { action });

    await user.type(screen.getByLabelText('Email'), invalidEmail);
    await user.type(screen.getByLabelText('Username'), invalidUsername);
    await user.type(screen.getByLabelText('Password'), invalidPassword);
    await user.type(screen.getByLabelText('Age'), invalidAge);
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByText(expectedEmailErrorMessage)).toBeVisible();
    expect(screen.getByText(expectedUsernameErrorMessage)).toBeVisible();
    expect(screen.getByText(expectedPasswordErrorMessage)).toBeVisible();
    expect(screen.getByText(expectedAgeErrorMessage)).toBeVisible();
  });

  test('Passes correct data to action handler', async () => {
    const { action, dataSpy } = createRouteAction();
    const email = 'test@example.com';
    const username = 'test_username';
    const password = 'test_password';
    const age = '20';
    const expectedData = {
      email: 'test@example.com',
      username: 'test_username',
      password: 'test_password',
      age: '20',
    };
    const { user } = renderWithRouter(<Register />, { action });

    await user.type(screen.getByLabelText('Email'), email);
    await user.type(screen.getByLabelText('Username'), username);
    await user.type(screen.getByLabelText('Password'), password);
    await user.type(screen.getByLabelText('Age'), age);
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
