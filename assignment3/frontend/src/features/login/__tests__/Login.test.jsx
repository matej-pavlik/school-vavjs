import { renderWithRouter, screen, within } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import Login from '../Login';

describe('<Login />', () => {
  test('Correct visibility', async () => {
    const expectedHeading = 'Log in';
    const expectedLoginLabel = 'Login';
    const expectedPasswordLabel = 'Password';
    const expectedLoginButtonText = 'Log in';
    const expectedNonMemberText = 'Not a member?';
    const expectedRegisterLinkText = 'Register';
    renderWithRouter(<Login />);

    expect(screen.getByRole('heading', { name: expectedHeading })).toBeVisible();
    expect(screen.getByLabelText(expectedLoginLabel)).toBeVisible();
    expect(screen.getByLabelText(expectedPasswordLabel)).toBeVisible();
    expect(screen.getByRole('button', { name: expectedLoginButtonText })).toBeVisible();
    expect(screen.getByText(expectedNonMemberText)).toBeVisible();
    expect(screen.getByRole('link', { name: expectedRegisterLinkText })).toBeVisible();
  });

  test('Correct visibility: failed login', async () => {
    const action = () => ({
      errors: [{ scope: 'GENERIC', message: 'Invalid credentials', metadata: {} }],
    });
    const invalidLogin = 'invalid_login';
    const invalidPassword = 'invalid_password';
    const expectedErrorMessage = 'Invalid credentials';
    const { user } = renderWithRouter(<Login />, { action });

    await user.type(screen.getByLabelText('Login'), invalidLogin);
    await user.type(screen.getByLabelText('Password'), invalidPassword);
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(within(screen.getByRole('alert')).getByText(expectedErrorMessage)).toBeVisible();
  });

  test('Passes correct data to action handler', async () => {
    const { action, dataSpy } = createRouteAction();
    const login = 'test_username';
    const password = 'test_password';
    const expectedData = {
      login: 'test_username',
      password: 'test_password',
    };
    const { user } = renderWithRouter(<Login />, { action });

    await user.type(screen.getByLabelText('Login'), login);
    await user.type(screen.getByLabelText('Password'), password);
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
