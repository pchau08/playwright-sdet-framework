const base = require('@playwright/test');
const UserApi = require('../api/user.api');
const ListingApi = require('../api/listing.api');

exports.test = base.test.extend({
  listingApi: async ({ request }, use) => {
    const email = process.env.DELEK_ADMIN_EMAIL;
    const password = process.env.DELEK_ADMIN_PASSWORD;

    if (!email) throw new Error('Missing DELEK_ADMIN_EMAIL in environment');
    if (!password) throw new Error('Missing DELEK_ADMIN_PASSWORD in environment');

    const userApi = new UserApi(request);
    const token = await userApi.login(email, password);

    const listingApi = new ListingApi(request, { token });
    await use(listingApi);
  },
});

exports.expect = base.expect;