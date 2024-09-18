import { Test, TestingModule } from '@nestjs/testing';
import { CulturaRestauranteService } from './cultura-restaurante.service';

describe('CulturaRestauranteService', () => {
  let service: CulturaRestauranteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CulturaRestauranteService],
    }).compile();

    service = module.get<CulturaRestauranteService>(CulturaRestauranteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
