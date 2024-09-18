import { Test, TestingModule } from '@nestjs/testing';
import { CulturaProductoService } from './cultura-producto.service';

describe('CulturaProductoService', () => {
  let service: CulturaProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CulturaProductoService],
    }).compile();

    service = module.get<CulturaProductoService>(CulturaProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
