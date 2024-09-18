/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

import { faker } from '@faker-js/faker';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restaurantesList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        estrellasMichelin: '1',
        fechaConsecuencion: faker.date.past(),
      });
      restaurantesList.push(restaurante);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantesList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurante: RestauranteEntity = restaurantesList[0];
    const restaurante: RestauranteEntity = await service.findOne(
      storedRestaurante.id,
    );

    const normalizeDate = (date: Date | string) => {
      const normalizedDate = new Date(date);
      normalizedDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00 UTC to ignore timezone
      return normalizedDate;
    };

    const expectedDate = normalizeDate(storedRestaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0]; // Get only the date part

    const actualDate = normalizeDate(restaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0]; // Get only the date part

    expect(actualDate).toEqual(expectedDate); // Compare the date parts
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('create should return a new restaurant', async () => {
    const restaurante: RestauranteEntity = {
      id: '',
      nombre: faker.company.name(),
      estrellasMichelin: '1',
      fechaConsecuencion: faker.date.past(),
      culturas: [],
      restaurante: null,
    };

    const newRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: newRestaurante.id },
    });

    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(newRestaurante.nombre);
    expect(storedRestaurante.estrellasMichelin).toEqual(
      newRestaurante.estrellasMichelin,
    );

    const expectedDate = new Date(storedRestaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0];
    const actualDate = new Date(newRestaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0];

    expect(expectedDate).toEqual(actualDate);
  });

  it('update should modify a restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    restaurante.nombre = 'Updated Restaurant Name';
    restaurante.estrellasMichelin = '2';

    const updatedRestaurante: RestauranteEntity = await service.update(
      restaurante.id,
      restaurante,
    );
    expect(updatedRestaurante).not.toBeNull();

    const storedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre);
    expect(storedRestaurante.estrellasMichelin).toEqual(
      restaurante.estrellasMichelin,
    );
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurante: RestauranteEntity = restaurantesList[0];
    restaurante = {
      ...restaurante,
      nombre: 'Updated Restaurant Name',
      estrellasMichelin: '2',
    };
    await expect(() => service.update('0', restaurante)).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);

    const deletedRestaurante: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(deletedRestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
});
