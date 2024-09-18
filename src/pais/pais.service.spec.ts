/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisService } from './pais.service';
import { PaisEntity } from './pais.entity';
import { Repository } from 'typeorm';

import { faker } from '@faker-js/faker';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    paisList = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await repository.save({
        nombre: faker.location.country(),
        alpha2: faker.location.countryCode('alpha-2'),
      });
      paisList.push(pais);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all countries', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisList.length);
  });

  it('findOne should return a country by id', async () => {
    const storedPais: PaisEntity = paisList[0];
    const pais: PaisEntity = await service.findOne(storedPais.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre);
    expect(pais.alpha2).toEqual(storedPais.alpha2);
  });

  it('findOne should throw an exception for an invalid country', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('create should return a new country', async () => {
    const pais: PaisEntity = {
      id: '',
      nombre: faker.location.country(),
      alpha2: faker.location.countryCode('alpha-2'),
      culturas: [],
      ciudades: [],
    };

    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({
      where: { id: newPais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(newPais.nombre);
    expect(storedPais.alpha2).toEqual(newPais.alpha2);
  });

  it('update should modify a country', async () => {
    const pais: PaisEntity = paisList[0];
    pais.nombre = 'New Country Name';
    pais.alpha2 = 'NC';

    const updatedPais: PaisEntity = await service.update(pais.id, pais);
    expect(updatedPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre);
    expect(storedPais.alpha2).toEqual(pais.alpha2);
  });

  it('update should throw an exception for an invalid country', async () => {
    let pais: PaisEntity = paisList[0];
    pais = { ...pais, nombre: 'New Name', alpha2: 'NN' };
    await expect(() => service.update('0', pais)).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('delete should remove a country', async () => {
    const pais: PaisEntity = paisList[0];
    await service.delete(pais.id);

    const deletedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(deletedPais).toBeNull();
  });

  it('delete should throw an exception for an invalid country', async () => {
    const pais: PaisEntity = paisList[0];
    await service.delete(pais.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });
});
