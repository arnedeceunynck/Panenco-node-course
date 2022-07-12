import { expect } from "chai";
import { request } from "express";
import supertest from "supertest";
import { App } from "../../app";
import { User, UserStore } from "../../controllers/users/handlers/user.store";

// calling an endpoint
const { body: createResponse } = await request
  .post(`/api/users`) // post a certain route
  .send({
    name: 'test',
    email: 'test-user+1@panenco.com',
    password: 'real secret stuff',
  } as User) // Send a request body
  .set('x-auth', 'api-key') // Set some header
  .expect(200); // Here you can already expect a certain status code.
  
// bootstrapping the server with supertest
describe('Integration tests', () => {
    describe('User Tests', () => {
      let request: supertest.SuperTest<supertest.Test>;
      beforeEach(() => {
        const app = new App();
        request = supertest(app.host);
      });
      it('should CRUD users', async () => {
        // Unauthorized without "api-key"
        await request.post(`/api/users`).expect(401);
      
        // Successfully create new user
        const { body: createResponse } = await request
          .post(`/api/users`)
          .send({
            name: 'test',
            email: 'test-user+1@panenco.com',
            password: 'real secret stuff',
          } as User)
          .set('x-auth', 'api-key')
          .expect(200);
      
        expect(UserStore.users.some((x) => x.email === createResponse.email)).true;
      
        // Get the newly created user
        const { body: getResponse } = await request.get(`/api/users/${createResponse.id}`).expect(200);
        expect(getResponse.name).equal('test');
      
        // Successfully update user
        const { body: updateResponse } = await request
          .patch(`/api/users/${createResponse.id}`)
          .send({
            email: 'test-user+updated@panenco.com',
          } as User)
          .set('x-auth', 'api-key')
          .expect(200);
      
        expect(updateResponse.name).equal('test');
        expect(updateResponse.email).equal('test-user+updated@panenco.com');
        expect(updateResponse.password).undefined; // middleware transformed the object to not include the password
      
        // Get all users
        const { body: getAllResponse } = await request.get(`/api/users`).expect(200);
      
        const newUser = getAllResponse.find((x: User) => x.name === getResponse.name);
        expect(newUser).not.undefined;
        expect(newUser.email).equal('test-user+updated@panenco.com');
      
        // Get the newly created user
        await request.delete(`/api/users/${createResponse.id}`).expect(204);
      
        // Get all users again after deleted the only user
        const { body: getNoneResponse } = await request.get(`/api/users`).expect(200);
        expect(getNoneResponse.length).equal(0);
      });
    });
  });




