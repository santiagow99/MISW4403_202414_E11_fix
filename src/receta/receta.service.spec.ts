/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

import { faker } from '@faker-js/faker';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.lorem.sentence(),
        foto: faker.internet.url(),
        proceso: faker.lorem.paragraph(),
        video: faker.internet.url(),
      });
      recetasList.push(receta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recipes', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne should return a recipe by id', async () => {
    const storedReceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre);
    expect(receta.descripcion).toEqual(storedReceta.descripcion);
    expect(receta.foto).toEqual(storedReceta.foto);
    expect(receta.proceso).toEqual(storedReceta.proceso);
    expect(receta.video).toEqual(storedReceta.video);
  });

  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('create should return a new recipe', async () => {
    const receta: RecetaEntity = {
      id: '',
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      foto: faker.internet.url(),
      proceso: faker.lorem.paragraph(),
      video: faker.internet.url(),
      cultura: null,
    };

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: newReceta.id },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre);
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion);
    expect(storedReceta.foto).toEqual(newReceta.foto);
    expect(storedReceta.proceso).toEqual(newReceta.proceso);
    expect(storedReceta.video).toEqual(newReceta.video);
  });

  it('update should modify a recipe', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = 'New recipe name';
    receta.proceso = 'New recipe process';

    const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.proceso).toEqual(receta.proceso);
  });

  it('update should throw an exception for an invalid recipe', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta,
      nombre: 'Updated recipe name',
      proceso: 'Updated recipe process',
    };
    await expect(() => service.update('0', receta)).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('delete should remove a recipe', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);

    const deletedReceta: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(deletedReceta).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });
});
