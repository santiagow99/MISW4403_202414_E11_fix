import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';
import { faker } from '@faker-js/faker';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: Repository<CategoriaEntity>;
  let categoriasList: CategoriaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaService],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categoriasList = [];
    for (let i = 0; i < 5; i++) {
      const categoria: CategoriaEntity = await repository.save({
        nombre: faker.commerce.department(),
        codigo: faker.string.alphanumeric(5),
        productos: [],
      });
      categoriasList.push(categoria);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all categories', async () => {
    const categorias: CategoriaEntity[] = await service.findAll();
    expect(categorias).not.toBeNull();
    expect(categorias).toHaveLength(categoriasList.length);
  });

  it('findOne should return a category by id', async () => {
    const storedCategoria: CategoriaEntity = categoriasList[0];
    const categoria: CategoriaEntity = await service.findOne(
      storedCategoria.id,
    );
    expect(categoria).not.toBeNull();
    expect(categoria.nombre).toEqual(storedCategoria.nombre);
    expect(categoria.codigo).toEqual(storedCategoria.codigo);
  });

  it('findOne should throw an exception for an invalid category', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('create should return a new category', async () => {
    const categoria: CategoriaEntity = {
      id: '',
      nombre: faker.commerce.department(),
      codigo: faker.string.alphanumeric(5),
      productos: [],
    };

    const newCategoria: CategoriaEntity = await service.create(categoria);
    expect(newCategoria).not.toBeNull();

    const storedCategoria: CategoriaEntity = await repository.findOne({
      where: { id: newCategoria.id },
    });
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(newCategoria.nombre);
    expect(storedCategoria.codigo).toEqual(newCategoria.codigo);
  });

  it('update should modify a category', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    categoria.nombre = 'New name';
    categoria.codigo = 'New code';

    const updatedCategoria: CategoriaEntity = await service.update(
      categoria.id,
      categoria,
    );
    expect(updatedCategoria).not.toBeNull();

    const storedCategoria: CategoriaEntity = await repository.findOne({
      where: { id: categoria.id },
    });
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(categoria.nombre);
    expect(storedCategoria.codigo).toEqual(categoria.codigo);
  });

  it('update should throw an exception for an invalid category', async () => {
    let categoria: CategoriaEntity = categoriasList[0];
    categoria = { ...categoria, nombre: 'New name', codigo: 'New code' };
    await expect(() => service.update('0', categoria)).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('delete should remove a category', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    await service.delete(categoria.id);

    const deletedCategoria: CategoriaEntity = await repository.findOne({
      where: { id: categoria.id },
    });
    expect(deletedCategoria).toBeNull();
  });

  it('delete should throw an exception for an invalid category', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    await service.delete(categoria.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });
});
