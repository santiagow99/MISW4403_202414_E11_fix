import { Test, TestingModule } from '@nestjs/testing';
import { CulturaPaisService } from './cultura-pais.service';

describe('CulturaPaisService', () => {
  let service: CulturaPaisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CulturaPaisService],
    }).compile();

    service = module.get<CulturaPaisService>(CulturaPaisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
