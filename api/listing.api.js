const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

class ListingApi {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {{ token: string }} auth
   */
  constructor(request, auth) {
    this.request = request;
    this.token = auth.token;
  }

  _authHeaders() {
    return { authorization: `Bearer ${this.token}` };
  }

  buildListingPayload(overrides = {}) {
    const imagePath = path.join(__dirname, '../data/garagegameroom.jpg');

    const payload = {
      images: fs.createReadStream(imagePath),
      lotSize: 4000,
      sqft: 3000,
      garage: 2,
      bathrooms: 3,
      bedrooms: 4,
      price: faker.number.int({ min: 500000, max: 1000000 }),
      zipCode: '66666',
      state: 'IL',
      city: 'Chicago',
      address: '1111 Testing Lane',
      description: `Testing QA Cabin ${faker.number.int({ min: 1000, max: 10000 })}`,
      title: `Some Random Cabin ${faker.number.int({ min: 1000, max: 10000 })}`,
      isPublished: true,
      ...overrides,
    };

    return payload;
  }

  async createListing(overrides = {}) {
    const response = await this.request.post('/api/estate-objects', {
      multipart: this.buildListingPayload(overrides),
      headers: this._authHeaders(),
    });

    const bodyText = await response.text();

    if (!response.ok()) {
      throw new Error(`Create listing failed: ${response.status()} ${bodyText}`);
    }

    try {
      return JSON.parse(bodyText);
    } catch {
      return bodyText;
    }
  }

  async deleteListing(listingId) {
    const response = await this.request.delete(`/api/estate-objects/${listingId}`, {
      headers: this._authHeaders(),
    });

    if (!response.ok()) {
      const text = await response.text().catch(() => '');
      throw new Error(`Delete listing failed (${listingId}): ${response.status()} ${text}`);
    }
  }

  async searchPublicByCity(city, { page = 1, limit = 6 } = {}) {
    const params = new URLSearchParams();
    params.set('city', city);
    params.set('page', String(page));
    params.set('offset', '0');
    params.set('limit', String(limit));

    const response = await this.request.get(`/api/estate-objects/public?${params.toString()}`);
    const bodyText = await response.text();

    if (!response.ok()) {
      throw new Error(`Public search failed: ${response.status()} ${bodyText}`);
    }

    return JSON.parse(bodyText);
  }
}

module.exports = ListingApi;