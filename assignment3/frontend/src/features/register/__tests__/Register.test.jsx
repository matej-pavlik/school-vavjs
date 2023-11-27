import { renderWithRouter, screen } from '@test/test-utils';
import { createRouteAction } from '@test/utils';
import { describe, expect, test } from 'vitest';
import Register from '../Register';

describe('<Register />', () => {
  test('Correct visibility & successful register', async () => {
    const email = 'test@example.com';
    const username = 'test_username';
    const password = 'test_password';
    const age = '20';
    const path = '/register';
    const { action, dataSpy } = createRouteAction();
    const expectedHeading = 'Register';
    const expectedEmailLabel = 'Email';
    const expectedUsernameLabel = 'Username';
    const expectedPasswordLabel = 'Password';
    const expectedAgeLabel = 'Age';
    const expectedRegisterButtonText = 'Register';
    const expectedNonMemberText = 'Already a member?';
    const expectedLoginLinkText = 'Log in';
    const expectedData = {
      email: 'test@example.com',
      username: 'test_username',
      password: 'test_password',
      age: '20',
    };
    const { user } = renderWithRouter(<Register />, { path, action });

    await user.type(screen.getByLabelText(expectedEmailLabel), email);
    await user.type(screen.getByLabelText(expectedUsernameLabel), username);
    await user.type(screen.getByLabelText(expectedPasswordLabel), password);
    await user.type(screen.getByLabelText(expectedAgeLabel), age);
    await user.click(screen.getByRole('button', { name: expectedRegisterButtonText }));

    expect(screen.getByRole('heading', { name: expectedHeading })).toBeVisible();
    expect(screen.getByRole('button', { name: expectedRegisterButtonText })).toBeVisible();
    expect(screen.getByText(expectedNonMemberText)).toBeVisible();
    expect(screen.getByRole('link', { name: expectedLoginLinkText })).toBeVisible();
    expect(dataSpy).toHaveBeenCalledWith(expectedData);
  });
});
