/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisCiudadService } from './pais-ciudad.service';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { faker } from '@faker-js/faker';

describe('PaisCiudadService', () => {
  let service: PaisCiudadService;
  let paisRepository: Repository<PaisEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let pais: PaisEntity;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisCiudadService],
    }).compile();

    service = module.get<PaisCiudadService>(PaisCiudadService);
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    paisRepository.clear();

    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.location.city(),
        codigo: faker.location.zipCode(),
      });
      ciudadesList.push(ciudad);
    }

    pais = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.location.countryCode(),
      ciudades: ciudadesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCiudadToPais should add a city to a country', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      codigo: faker.location.zipCode(),
    });

    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.location.countryCode(),
    });

    const result: PaisEntity = await service.addCiudadToPais(
      newPais.id,
      newCiudad.id,
    );

    expect(result.ciudades.length).toBe(1);
    expect(result.ciudades[0]).not.toBeNull();
    expect(result.ciudades[0].nombre).toBe(newCiudad.nombre);
    expect(result.ciudades[0].codigo).toBe(newCiudad.codigo);
  });

  it('addCiudadToPais should throw an exception for an invalid city', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.location.countryCode(),
    });

    await expect(() =>
      service.addCiudadToPais(newPais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('addCiudadToPais should throw an exception for an invalid country', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      codigo: faker.location.zipCode(),
    });

    await expect(() =>
      service.addCiudadToPais('0', newCiudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findCiudadByPaisIdCiudadId should return a city by country', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    const storedCiudad: CiudadEntity = await service.findCiudadByPaisIdCiudadId(
      pais.id,
      ciudad.id,
    );

    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toBe(ciudad.nombre);
    expect(storedCiudad.codigo).toBe(ciudad.codigo);
  });

  it('findCiudadByPaisIdCiudadId should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findCiudadByPaisIdCiudadId(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findCiudadByPaisIdCiudadId should throw an exception for an invalid country', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() =>
      service.findCiudadByPaisIdCiudadId('0', ciudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findCiudadesByPaisId should return all cities by country', async () => {
    const ciudades: CiudadEntity[] = await service.findCiudadesByPaisId(
      pais.id,
    );
    expect(ciudades.length).toBe(5);
  });

  it('findCiudadesByPaisId should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.findCiudadesByPaisId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('associateCiudadesToPais should update the list of cities for a country', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      codigo: faker.location.zipCode(),
    });

    const updatedPais: PaisEntity = await service.associateCiudadesToPais(
      pais.id,
      [newCiudad],
    );

    expect(updatedPais.ciudades.length).toBe(1);
    expect(updatedPais.ciudades[0].nombre).toBe(newCiudad.nombre);
    expect(updatedPais.ciudades[0].codigo).toBe(newCiudad.codigo);
  });

  it('associateCiudadesToPais should throw an exception for an invalid country', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      codigo: faker.location.zipCode(),
    });

    await expect(() =>
      service.associateCiudadesToPais('0', [newCiudad]),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('associateCiudadesToPais should throw an exception for an invalid city', async () => {
    const invalidCiudad: CiudadEntity = ciudadesList[0];
    invalidCiudad.id = '0';

    await expect(() =>
      service.associateCiudadesToPais(pais.id, [invalidCiudad]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteCiudadFromPais should remove a city from a country', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];

    await service.deleteCiudadFromPais(pais.id, ciudad.id);

    const storedPais: PaisEntity = await paisRepository.findOne({
      where: { id: pais.id },
      relations: ['ciudades'],
    });

    const deletedCiudad: CiudadEntity = storedPais.ciudades.find(
      (r) => r.id === ciudad.id,
    );

    expect(deletedCiudad).toBeUndefined();
  });

  it('deleteCiudadFromPais should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.deleteCiudadFromPais(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteCiudadFromPais should throw an exception for an invalid country', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() =>
      service.deleteCiudadFromPais('0', ciudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });
});
