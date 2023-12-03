import { expect } from 'expect';
import { afterEach, beforeEach, describe, test } from 'mocha';
import pptrTL from 'pptr-testing-library';
import puppeteer from 'puppeteer';
import db from '../../src/db/index.js';
import { hashPassword } from '../../src/utils/security.js';

const { getDocument, queries } = pptrTL;
const { queryByRole, findByLabelText, findByRole } = queries;

describe('E2E: Add new ride', () => {
  // TODO custom docker container for e2e tests
  beforeEach(async () => {
    await db.initialize();
    await db.user.delete({ email: 'e2e@example.com' }); // By deleting the user we also cascade delete all his rides
    await db.user.save({
      email: 'e2e@example.com',
      username: 'e2e',
      password: await hashPassword('e2e_password'),
      age: 40,
    });
  });

  let browser;

  test('Correctly adds new ride', async () => {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(process.env.E2E_APP_URL);
    const document = await getDocument(page);
    const login = 'e2e@example.com';
    const password = 'e2e_password';
    const rideType = 'Duration';
    const rideDate = '05/23/2023';
    const rideValue = '2000';
    const expectedRideRow = '23.05.2023 Duration 2000 Delete';

    await findByLabelText(document, 'Login');
    await (await findByLabelText(document, 'Login')).type(login);
    await (await findByLabelText(document, 'Password')).type(password);
    await (await findByRole(document, 'button', { name: 'Log in' })).click();
    await findByRole(document, 'heading', { name: 'List of rides' });

    expect(await queryByRole(document, 'row', { name: expectedRideRow })).toEqual(null);

    await (await findByRole(document, 'link', { name: 'Add new ride' })).click();
    await (await findByLabelText(document, 'Type')).click();
    await (await findByRole(document, 'option', { name: rideType })).click();
    await (await findByLabelText(document, 'Date')).type(rideDate);
    await (await findByLabelText(document, 'Value')).type(rideValue);
    await (await findByRole(document, 'button', { name: 'Add new ride' })).click();
    await findByRole(document, 'heading', { name: 'List of rides' });

    expect(await queryByRole(document, 'row', { name: expectedRideRow })).not.toEqual(null);
  });

  afterEach(async () => {
    browser.close();
  });
});
