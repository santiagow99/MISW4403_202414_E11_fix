import { Test, TestingModule } from '@nestjs/testing';
import { CulturaRecetaService } from './cultura-receta.service';

describe('CulturaRecetaService', () => {
  let service: CulturaRecetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CulturaRecetaService],
    }).compile();

    service = module.get<CulturaRecetaService>(CulturaRecetaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
