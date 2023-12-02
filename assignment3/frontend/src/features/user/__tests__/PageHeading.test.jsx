import { render, screen } from '@test/test-utils';
import { describe, expect, test } from 'vitest';
import PageHeading from '../PageHeading';

describe('<PageHeading />', () => {
  test('Correct visibility', () => {
    const expectedHeading = 'Heading';
    render(<PageHeading>{expectedHeading}</PageHeading>);

    expect(screen.getByRole('heading', { name: expectedHeading })).toBeVisible();
  });
});
