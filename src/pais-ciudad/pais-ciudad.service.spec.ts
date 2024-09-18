import { Test, TestingModule } from '@nestjs/testing';
import { PaisCiudadService } from './pais-ciudad.service';

describe('PaisCiudadService', () => {
  let service: PaisCiudadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaisCiudadService],
    }).compile();

    service = module.get<PaisCiudadService>(PaisCiudadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
