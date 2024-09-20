/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { faker } from '@faker-js/faker';

describe('CulturaRestauranteService', () => {
  let service: CulturaRestauranteService;
  let culturaRepository: Repository<CulturaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let cultura: CulturaEntity;
  let restaurantesList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaRestauranteService],
    }).compile();

    service = module.get<CulturaRestauranteService>(CulturaRestauranteService);
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    culturaRepository.clear();

    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        estrellasMichelin: '1',
        fechaConsecuencion: faker.date.past(),
      });
      restaurantesList.push(restaurante);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      restaurantes: restaurantesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestauranteCultura should add a restaurant to a culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichelin: '1',
      fechaConsecuencion: faker.date.past(),
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    const result: CulturaEntity = await service.addRestauranteCultura(
      newCultura.id,
      newRestaurante.id,
    );

    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(result.restaurantes[0].estrellasMichelin).toBe(
      newRestaurante.estrellasMichelin,
    );

    const expectedDate = new Date(newRestaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0];
    const actualDate = new Date(result.restaurantes[0].fechaConsecuencion)
      .toISOString()
      .split('T')[0];
    expect(actualDate).toEqual(expectedDate);
  });

  it('addRestauranteCultura should throw an exception for an invalid restaurant', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addRestauranteCultura(newCultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('addRestauranteCultura should throw an exception for an invalid culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichelin: '1',
      fechaConsecuencion: faker.date.past(),
    });

    await expect(() =>
      service.addRestauranteCultura('0', newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findRestauranteByCulturaIdRestauranteId should return a restaurant by culture', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    const storedRestaurante: RestauranteEntity =
      await service.findRestauranteByCulturaIdRestauranteId(
        cultura.id,
        restaurante.id,
      );

    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toBe(restaurante.nombre);
    expect(storedRestaurante.estrellasMichelin).toBe(
      restaurante.estrellasMichelin,
    );

    const expectedDate = new Date(restaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0];
    const actualDate = new Date(storedRestaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0];
    expect(actualDate).toEqual(expectedDate);
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findRestauranteByCulturaIdRestauranteId(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for an invalid culture', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(() =>
      service.findRestauranteByCulturaIdRestauranteId('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findRestauranteByCulturaIdRestauranteId should throw an exception for a restaurant not associated with the culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichelin: '1',
      fechaConsecuencion: faker.date.past(),
    });

    await expect(() =>
      service.findRestauranteByCulturaIdRestauranteId(
        cultura.id,
        newRestaurante.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated with the culture',
    );
  });

  it('findRestaurantesByCulturaId should return all restaurants by culture', async () => {
    const restaurantes: RestauranteEntity[] =
      await service.findRestaurantesByCulturaId(cultura.id);
    expect(restaurantes.length).toBe(5);
  });

  it('findRestaurantesByCulturaId should throw an exception for an invalid culture', async () => {
    await expect(() =>
      service.findRestaurantesByCulturaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateRestaurantesCultura should update the list of restaurants for a culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichelin: '1',
      fechaConsecuencion: faker.date.past(),
    });

    const updatedCultura: CulturaEntity =
      await service.associateRestaurantesCultura(cultura.id, [newRestaurante]);

    expect(updatedCultura.restaurantes.length).toBe(1);
    expect(updatedCultura.restaurantes[0].nombre).toBe(newRestaurante.nombre);
  });

  it('associateRestaurantesCultura should throw an exception for an invalid culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichelin: '1',
      fechaConsecuencion: faker.date.past(),
    });

    await expect(() =>
      service.associateRestaurantesCultura('0', [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateRestaurantesCultura should throw an exception for an invalid restaurant', async () => {
    const invalidRestaurante: RestauranteEntity = restaurantesList[0];
    invalidRestaurante.id = '0';

    await expect(() =>
      service.associateRestaurantesCultura(cultura.id, [invalidRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('deleteRestauranteCultura should remove a restaurant from a culture', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];

    await service.deleteRestauranteCultura(cultura.id, restaurante.id);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({
      where: { id: cultura.id },
      relations: ['restaurantes'],
    });

    const deletedRestaurante: RestauranteEntity =
      storedCultura.restaurantes.find((r) => r.id === restaurante.id);

    expect(deletedRestaurante).toBeUndefined();
  });

  it('deleteRestauranteCultura should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.deleteRestauranteCultura(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('deleteRestauranteCultura should throw an exception for an invalid culture', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];
    await expect(() =>
      service.deleteRestauranteCultura('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('deleteRestauranteCultura should throw an exception for a restaurant not associated with the culture', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichelin: '1',
      fechaConsecuencion: faker.date.past(),
    });

    await expect(() =>
      service.deleteRestauranteCultura(cultura.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated with the culture',
    );
  });
});
