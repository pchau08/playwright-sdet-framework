class UserApi {
  constructor(request) {
    this.request = request;
  }

  async login(email, password) {
    const response = await this.request.post('/api/users/login', {
      data: { email, password },
    });

    const bodyText = await response.text();

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${bodyText}`);
    }

    const body = JSON.parse(bodyText);
    return body.accessToken;
  }
}

module.exports = UserApi;