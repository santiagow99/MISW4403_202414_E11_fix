/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaRecetaService } from './cultura-receta.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { faker } from '@faker-js/faker';

describe('CulturaRecetaService', () => {
  let service: CulturaRecetaService;
  let culturaRepository: Repository<CulturaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let cultura: CulturaEntity;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaRecetaService],
    }).compile();

    service = module.get<CulturaRecetaService>(CulturaRecetaService);
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaRepository.clear();

    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.lorem.word(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.url(),
        proceso: faker.lorem.paragraph(),
        video: faker.internet.url(),
      });
      recetasList.push(receta);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      recetas: recetasList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecetaCultura should add a recipe to a culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.url(),
      proceso: faker.lorem.paragraph(),
      video: faker.internet.url(),
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    const result: CulturaEntity = await service.addRecetaCultura(
      newCultura.id,
      newReceta.id,
    );

    expect(result.recetas.length).toBe(1);
    expect(result.recetas[0]).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(newReceta.nombre);
    expect(result.recetas[0].descripcion).toBe(newReceta.descripcion);
    expect(result.recetas[0].foto).toBe(newReceta.foto);
    expect(result.recetas[0].proceso).toBe(newReceta.proceso);
    expect(result.recetas[0].video).toBe(newReceta.video);
  });

  it('addRecetaCultura should throw an exception for an invalid recipe', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addRecetaCultura(newCultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('addRecetaCultura should throw an exception for an invalid culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.url(),
      proceso: faker.lorem.paragraph(),
      video: faker.internet.url(),
    });

    await expect(() =>
      service.addRecetaCultura('0', newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findRecetaByCulturaIdRecetaId should return a recipe by culture', async () => {
    const receta: RecetaEntity = recetasList[0];
    const storedReceta: RecetaEntity =
      await service.findRecetaByCulturaIdRecetaId(cultura.id, receta.id);

    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toBe(receta.nombre);
    expect(storedReceta.descripcion).toBe(receta.descripcion);
    expect(storedReceta.foto).toBe(receta.foto);
    expect(storedReceta.proceso).toBe(receta.proceso);
    expect(storedReceta.video).toBe(receta.video);
  });

  it('findRecetaByCulturaIdRecetaId should throw an exception for an invalid recipe', async () => {
    await expect(() =>
      service.findRecetaByCulturaIdRecetaId(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('findRecetaByCulturaIdRecetaId should throw an exception for an invalid culture', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(() =>
      service.findRecetaByCulturaIdRecetaId('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findRecetasByCulturaId should return all recipes by culture', async () => {
    const recetas: RecetaEntity[] = await service.findRecetasByCulturaId(
      cultura.id,
    );
    expect(recetas.length).toBe(5);
  });

  it('findRecetasByCulturaId should throw an exception for an invalid culture', async () => {
    await expect(() =>
      service.findRecetasByCulturaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateRecetasCultura should update the list of recipes for a culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.url(),
      proceso: faker.lorem.paragraph(),
      video: faker.internet.url(),
    });

    const updatedCultura: CulturaEntity = await service.associateRecetasCultura(
      cultura.id,
      [newReceta],
    );

    expect(updatedCultura.recetas.length).toBe(1);
    expect(updatedCultura.recetas[0].nombre).toBe(newReceta.nombre);
  });

  it('associateRecetasCultura should throw an exception for an invalid culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.url(),
      proceso: faker.lorem.paragraph(),
      video: faker.internet.url(),
    });

    await expect(() =>
      service.associateRecetasCultura('0', [newReceta]),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateRecetasCultura should throw an exception for an invalid recipe', async () => {
    const invalidReceta: RecetaEntity = recetasList[0];
    invalidReceta.id = '0';

    await expect(() =>
      service.associateRecetasCultura(cultura.id, [invalidReceta]),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('deleteRecetaCultura should remove a recipe from a culture', async () => {
    const receta: RecetaEntity = recetasList[0];

    await service.deleteRecetaCultura(cultura.id, receta.id);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({
      where: { id: cultura.id },
      relations: ['recetas'],
    });

    const deletedReceta: RecetaEntity = storedCultura.recetas.find(
      (r) => r.id === receta.id,
    );

    expect(deletedReceta).toBeUndefined();
  });

  it('deleteRecetaCultura should throw an exception for an invalid recipe', async () => {
    await expect(() =>
      service.deleteRecetaCultura(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('deleteRecetaCultura should throw an exception for an invalid culture', async () => {
    const receta: RecetaEntity = recetasList[0];
    await expect(() =>
      service.deleteRecetaCultura('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('deleteRecetaCultura should throw an exception for a recipe not associated with the culture', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.url(),
      proceso: faker.lorem.paragraph(),
      video: faker.internet.url(),
    });

    await expect(() =>
      service.deleteRecetaCultura(cultura.id, newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id is not associated with the culture',
    );
  });
});
