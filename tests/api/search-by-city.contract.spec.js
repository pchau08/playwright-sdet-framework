const { test, expect } = require('@playwright/test');

function buildPublicEstateSearchQuery({ city, page = 1, limit = 6 }) {
  const params = new URLSearchParams();
  params.set('city', city);
  params.set('page', String(page));
  params.set('offset', '0');
  params.set('limit', String(limit));
  return `/api/estate-objects/public?${params.toString()}`;
}

test.describe('@api @contract', () => {
  test('Public estate search by city returns stable contract', async ({ request }, testInfo) => {
    const baseURL = testInfo.project.use.baseURL || 'https://dev.delekhomes.com';
    const path = buildPublicEstateSearchQuery({ city: 'Chicago', page: 1, limit: 6 });

    const res = await request.get(`${baseURL}${path}`);
    expect(res.ok()).toBeTruthy();

    const data = await res.json();

    expect(data).toEqual(
      expect.objectContaining({
        count: expect.any(Number),
        list: expect.any(Array),
      })
    );

    expect(data.list.length).toBeGreaterThan(0);

    const item = data.list[0];

    expect(item).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        description: expect.any(String),
        address: expect.any(String),
        city: expect.any(String),
        state: expect.any(String),
        zipCode: expect.any(String),
        price: expect.any(Number),
        bedrooms: expect.any(Number),
        bathrooms: expect.any(Number),
        garage: expect.any(Number),
        sqft: expect.any(Number),
        lotSize: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        images: expect.any(Array),
        isPublished: expect.any(Boolean),
        realtor: expect.any(Object),
        favorite: expect.any(Array),
      })
    );

    expect(item.city.toLowerCase()).toBe('chicago');

    for (const img of item.images) {
      expect(typeof img).toBe('string');
    }

    const { password, ...safeRealtor } = item.realtor;

    expect(safeRealtor).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        username: expect.any(String),
        user_surname: expect.any(String),
        email: expect.any(String),
      })
    );

    const exposesPasswordHash = Object.prototype.hasOwnProperty.call(item.realtor, 'password');

    testInfo.annotations.push({
      type: 'security',
      description: exposesPasswordHash
        ? 'SECURITY: API response exposes realtor.password hash (should be removed server-side).'
        : 'OK: API response does not expose sensitive credential fields.',
    });
  });
});