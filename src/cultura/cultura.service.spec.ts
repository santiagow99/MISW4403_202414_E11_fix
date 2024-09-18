import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaService } from './cultura.service';
import { CulturaEntity } from './cultura.entity';
import { Repository } from 'typeorm';

import { faker } from '@faker-js/faker';

describe('CulturaService', () => {
  let service: CulturaService;
  let repository: Repository<CulturaEntity>;
  let culturaList: CulturaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaService],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
    repository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    culturaList = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaEntity = await repository.save({
        nombre: faker.word.noun(),
        descripcion: faker.lorem.sentence(),
      });
      culturaList.push(cultura);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cultures', async () => {
    const culturas: CulturaEntity[] = await service.findAll();
    expect(culturas).not.toBeNull();
    expect(culturas).toHaveLength(culturaList.length);
  });

  it('findOne should return a culture by id', async () => {
    const storedCultura: CulturaEntity = culturaList[0];
    const cultura: CulturaEntity = await service.findOne(storedCultura.id);
    expect(cultura).not.toBeNull();
    expect(cultura.nombre).toEqual(storedCultura.nombre);
    expect(cultura.descripcion).toEqual(storedCultura.descripcion);
  });

  it('findOne should throw an exception for an invalid culture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('create should return a new culture', async () => {
    const cultura: CulturaEntity = {
      id: '',
      nombre: faker.word.noun(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      paises: [],
      productos: [],
      restaurantes: [],
    };

    const newCultura: CulturaEntity = await service.create(cultura);
    expect(newCultura).not.toBeNull();

    const storedCultura: CulturaEntity = await repository.findOne({
      where: { id: newCultura.id },
    });
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toEqual(newCultura.nombre);
    expect(storedCultura.descripcion).toEqual(newCultura.descripcion);
  });

  it('update should modify a culture', async () => {
    const cultura: CulturaEntity = culturaList[0];
    cultura.nombre = 'New Name';
    cultura.descripcion = 'New Description';

    const updatedCultura: CulturaEntity = await service.update(
      cultura.id,
      cultura,
    );
    expect(updatedCultura).not.toBeNull();

    const storedCultura: CulturaEntity = await repository.findOne({
      where: { id: cultura.id },
    });
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toEqual(cultura.nombre);
    expect(storedCultura.descripcion).toEqual(cultura.descripcion);
  });

  it('update should throw an exception for an invalid culture', async () => {
    let cultura: CulturaEntity = culturaList[0];
    cultura = {
      ...cultura,
      nombre: 'New Name',
      descripcion: 'New Description',
    };
    await expect(() => service.update('0', cultura)).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('delete should remove a culture', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await service.delete(cultura.id);

    const deletedCultura: CulturaEntity = await repository.findOne({
      where: { id: cultura.id },
    });
    expect(deletedCultura).toBeNull();
  });

  it('delete should throw an exception for an invalid culture', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await service.delete(cultura.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });
});
