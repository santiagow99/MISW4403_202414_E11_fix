import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaProductoService } from './categoria-producto.service';

describe('CategoriaProductoService', () => {
  let service: CategoriaProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaProductoService],
    }).compile();

    service = module.get<CategoriaProductoService>(CategoriaProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
