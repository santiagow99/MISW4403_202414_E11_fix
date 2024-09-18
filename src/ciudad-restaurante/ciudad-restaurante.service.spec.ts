import { Test, TestingModule } from '@nestjs/testing';
import { CiudadRestauranteService } from './ciudad-restaurante.service';

describe('CiudadRestauranteService', () => {
  let service: CiudadRestauranteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CiudadRestauranteService],
    }).compile();

    service = module.get<CiudadRestauranteService>(CiudadRestauranteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
