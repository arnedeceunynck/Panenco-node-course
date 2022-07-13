import { StatusCode } from '@panenco/papi';
import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import supertest from 'supertest';

import { App } from '../../app';
import { User, UserStore } from '../../controllers/users/handlers/user.store';

describe('Integration tests', () => {
  describe('User Tests', () => {
    let request: supertest.SuperTest<supertest.Test>;
    beforeEach(async () => {
      UserStore.users = [];
      const app = new App();

      request = supertest(app.host);
    });

    it('should CRUD users', async () => {
      // Unauthorized without "token"
      await request.get(`/api/users`).expect(StatusCode.unauthorized);

      // Successfully create new user
      const { body: createResponse } = await request
        .post(`/api/users`)
        .send({
          name: 'test',
          email: 'test-user+1@panenco.com',
          password: 'real secret stuff',
        } as User)
        .expect(StatusCode.created);

      // Login
      const { body: loginResponse } = await request
        .post(`/api/auth/tokens`)
        .send({
          email: 'test-user+1@panenco.com',
          password: 'real secret stuff',
        } as User)
        .expect(StatusCode.ok);
      const token = loginResponse.token;

      expect(UserStore.users.some((x) => x.email === createResponse.email)).true;

      // Get the newly created user
      const { body: getResponse } = await request
        .get(`/api/users/${createResponse.id}`)
        .set('x-auth', token)
        .expect(StatusCode.ok);
      expect(getResponse.name).equal('test');

      // Get all users
      const { body: getListRes } = await request.get(`/api/users`).set('x-auth', token).expect(StatusCode.ok);
      const { items, count } = getListRes;
      expect(items.length).equal(1);
      expect(count).equal(1);

      // Successfully update user
      const { body: updateResponse } = await request
        .patch(`/api/users/${createResponse.id}`)
        .send({
          email: 'test-user+1@panenco.com',
        } as User)
        .set('x-auth', token)
        .expect(StatusCode.ok);

      expect(updateResponse.name).equal('test');
      expect(updateResponse.email).equal('test-user+1@panenco.com');
      expect(updateResponse.password).undefined; // middleware transformed the object to not include the password

      // Get the newly created user
      await request.delete(`/api/users/${createResponse.id}`).set('x-auth', token).expect(204);

      // Get all users again after deleted the only user
      const { body: getNoneResponse } = await request.get(`/api/users`).set('x-auth', token).expect(StatusCode.ok);
      const { count: getNoneCount } = getNoneResponse;
      expect(getNoneCount).equal(0);
    });
  });
});