import { renderWithRouter, screen } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import Login from '../Login';

describe('<Login />', () => {
  test('Correct visibility & successful login', async () => {
    const login = 'test_username';
    const password = 'test_password';
    const path = '/login';
    const { action, dataSpy } = createRouteAction();
    const expectedHeading = 'Log in';
    const expectedLoginLabel = 'Login';
    const expectedPasswordLabel = 'Password';
    const expectedLoginButtonText = 'Log in';
    const expectedNonMemberText = 'Not a member?';
    const expectedRegisterLinkText = 'Register';
    const expectedData = {
      login: 'test_username',
      password: 'test_password',
    };
    const { user } = renderWithRouter(<Login />, { path, action });

    await user.type(screen.getByLabelText(expectedLoginLabel), login);
    await user.type(screen.getByLabelText(expectedPasswordLabel), password);
    await user.click(screen.getByRole('button', { name: expectedLoginButtonText }));

    expect(screen.getByRole('heading', { name: expectedHeading })).toBeVisible();
    expect(screen.getByRole('button', { name: expectedLoginButtonText })).toBeVisible();
    expect(screen.getByText(expectedNonMemberText)).toBeVisible();
    expect(screen.getByRole('link', { name: expectedRegisterLinkText })).toBeVisible();
    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
