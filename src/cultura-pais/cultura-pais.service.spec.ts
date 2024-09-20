import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaPaisService } from './cultura-pais.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { faker } from '@faker-js/faker';

describe('CulturaPaisService', () => {
  let service: CulturaPaisService;
  let culturaRepository: Repository<CulturaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let cultura: CulturaEntity;
  let paisesList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaPaisService],
    }).compile();

    service = module.get<CulturaPaisService>(CulturaPaisService);
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    culturaRepository.clear();

    paisesList = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await paisRepository.save({
        nombre: faker.location.country(),
        alpha2: faker.string.alpha(2),
      });
      paisesList.push(pais);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      paises: paisesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPaisCultura should add a country to a culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.string.alpha(2),
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    const result: CulturaEntity = await service.addPaisCultura(
      newCultura.id,
      newPais.id,
    );

    expect(result.paises.length).toBe(1);
    expect(result.paises[0].nombre).toBe(newPais.nombre);
    expect(result.paises[0].alpha2).toBe(newPais.alpha2);
  });

  it('addPaisCultura should throw an exception for an invalid country', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addPaisCultura(newCultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('addPaisCultura should throw an exception for an invalid culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.string.alpha(2),
    });

    await expect(() =>
      service.addPaisCultura('0', newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findPaisByCulturaIdPaisId should return a country by culture', async () => {
    const pais: PaisEntity = paisesList[0];
    const storedPais: PaisEntity = await service.findPaisByCulturaIdPaisId(
      cultura.id,
      pais.id,
    );

    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
    expect(storedPais.alpha2).toBe(pais.alpha2);
  });

  it('findPaisByCulturaIdPaisId should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.findPaisByCulturaIdPaisId(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findPaisByCulturaIdPaisId should throw an exception for an invalid culture', async () => {
    const pais: PaisEntity = paisesList[0];
    await expect(() =>
      service.findPaisByCulturaIdPaisId('0', pais.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findPaisesByCulturaId should return all countries by culture', async () => {
    const paises: PaisEntity[] = await service.findPaisesByCulturaId(
      cultura.id,
    );
    expect(paises.length).toBe(5);
  });

  it('findPaisesByCulturaId should throw an exception for an invalid culture', async () => {
    await expect(() =>
      service.findPaisesByCulturaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associatePaisesCultura should update the list of countries for a culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.string.alpha(2),
    });

    const updatedCultura: CulturaEntity = await service.associatePaisesCultura(
      cultura.id,
      [newPais],
    );

    expect(updatedCultura.paises.length).toBe(1);
    expect(updatedCultura.paises[0].nombre).toBe(newPais.nombre);
  });

  it('associatePaisesCultura should throw an exception for an invalid culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.string.alpha(2),
    });

    await expect(() =>
      service.associatePaisesCultura('0', [newPais]),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associatePaisesCultura should throw an exception for an invalid country', async () => {
    const invalidPais: PaisEntity = paisesList[0];
    invalidPais.id = '0';

    await expect(() =>
      service.associatePaisesCultura(cultura.id, [invalidPais]),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deletePaisCultura should remove a country from a culture', async () => {
    const pais: PaisEntity = paisesList[0];

    await service.deletePaisCultura(cultura.id, pais.id);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({
      where: { id: cultura.id },
      relations: ['paises'],
    });

    const deletedPais: PaisEntity = storedCultura.paises.find(
      (p) => p.id === pais.id,
    );

    expect(deletedPais).toBeUndefined();
  });

  it('deletePaisCultura should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.deletePaisCultura(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deletePaisCultura should throw an exception for an invalid culture', async () => {
    const pais: PaisEntity = paisesList[0];
    await expect(() =>
      service.deletePaisCultura('0', pais.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('deletePaisCultura should throw an exception for a country not associated with the culture', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country(),
      alpha2: faker.string.alpha(2),
    });

    await expect(() =>
      service.deletePaisCultura(cultura.id, newPais.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id is not associated with the culture',
    );
  });
});
