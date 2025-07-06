import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('OX Group Test API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test@example.com' })
      .expect(200)
      .expect((res) => {
        expect(res.body.result.otp).toBeDefined();
      });
  });

  it('/api/products (GET) should require authentication', () => {
    return request(app.getHttpServer())
      .get('/api/products')
      .expect(401);
  });
});
