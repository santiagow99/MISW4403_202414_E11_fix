import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CiudadRestauranteService', () => {
  let service: CiudadRestauranteService;
  let ciudadRepository: Repository<CiudadEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let ciudad: CiudadEntity;
  let restaurantesList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadRestauranteService],
    }).compile();

    service = module.get<CiudadRestauranteService>(CiudadRestauranteService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    restauranteRepository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    ciudadRepository.clear();

    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.company.name(),
        estrellasMichelin: faker.string.alphanumeric(2),
        fechaConsecuencion: faker.date.past(),
      });
      restaurantesList.push(restaurante);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      codigo: faker.string.alphanumeric(5),
      restaurantes: restaurantesList,
    });
  };

  const normalizeDate = (date: Date | string) => {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00 UTC to ignore timezone
    return normalizedDate;
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('associateRestaurantesCiudad should update restaurant list for a city', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      estrellasMichelin: faker.string.alphanumeric(2),
      fechaConsecuencion: faker.date.past(),
    });

    const updatedCiudad: CiudadEntity =
      await service.associateRestaurantesCiudad(ciudad.id, [newRestaurante]);
    expect(updatedCiudad.restaurantes.length).toBe(1);
    expect(updatedCiudad.restaurantes[0].nombre).toBe(newRestaurante.nombre);

    // Normalize and compare only the date parts
    const expectedDate = normalizeDate(newRestaurante.fechaConsecuencion)
      .toISOString()
      .split('T')[0];
    const actualDate = normalizeDate(
      updatedCiudad.restaurantes[0].fechaConsecuencion,
    )
      .toISOString()
      .split('T')[0];

    expect(actualDate).toEqual(expectedDate);
  });

  it('deleteRestauranteCiudad should remove a restaurant from a city', async () => {
    const restaurante: RestauranteEntity = restaurantesList[0];

    await service.deleteRestauranteCiudad(ciudad.id, restaurante.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['restaurantes'],
    });

    const deletedRestaurante: RestauranteEntity =
      storedCiudad.restaurantes.find((r) => r.id === restaurante.id);

    expect(deletedRestaurante).toBeUndefined();
  });
});
