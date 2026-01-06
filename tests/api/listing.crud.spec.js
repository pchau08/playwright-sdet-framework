const { test, expect } = require('../../fixtures/api.fixture');

test.describe('@api @crud', () => {
  test('Create → Search → Delete listing', async ({ listingApi }) => {
    let created;

    try {
      created = await listingApi.createListing({ city: 'Chicago' });
      expect(created).toEqual(expect.objectContaining({ id: expect.any(Number) }));

      const results = await listingApi.searchPublicByCity('Chicago', { page: 1, limit: 6 });
      const ids = results.list.map((x) => x.id);
      expect(ids).toContain(created.id);
    } finally {
      if (created?.id) await listingApi.deleteListing(created.id);
    }
  });
});