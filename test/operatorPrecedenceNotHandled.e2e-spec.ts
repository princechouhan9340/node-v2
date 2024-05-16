// calc.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('CalcController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('5. /calc (POST) - Test operator precedence is not handled', () => {
    return request(app.getHttpServer())
      .post('/calc')
      .send({ expression: '1+2*3' })
      .expect(201)
      .expect({ result: 7 });
  });
});
