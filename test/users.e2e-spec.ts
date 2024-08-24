import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  let userId: 1;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(mongoUri), // Use in-memory MongoDB
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Use InjectConnection to get the connection from the root Mongoose module
    connection = moduleFixture.get<Connection>(getConnectionToken()); // Inject the correct connection
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    await connection.dropDatabase(); // Clear the database before each test
  });

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@example.com',
        })
        .expect(201)
        .then((response) => {
          userId = response.body._id;
          expect(response.body).toHaveProperty('_id');
          expect(response.body.first_name).toBe('John');
          expect(response.body.email).toBe('johndoe@example.com');
        });
    });
  });

  describe('/users/:userId (GET)', () => {
    it('should retrieve a user by ID', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(userId);
          expect(response.body.first_name).toBe('George');
        });
    });
  });

  describe('/users/:userId/avatar (GET)', () => {
    it('should return the avatar of the user', async () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}/avatar`)
        .expect(200)
        .then((response) => {
          expect(response.body).toBeDefined();
        });
    });
  });

  describe('/users/:userId/avatar (DELETE)', () => {
    it('should not delete the avatar of the user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}/avatar`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toBe('Avatar not found');
        });
    });
  });
});
