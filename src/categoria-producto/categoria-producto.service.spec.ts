import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriaProductoService } from './categoria-producto.service';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CategoriaProductoService', () => {
  let service: CategoriaProductoService;
  let categoriaRepository: Repository<CategoriaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let categoria: CategoriaEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaProductoService],
    }).compile();

    service = module.get<CategoriaProductoService>(CategoriaProductoService);
    categoriaRepository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    categoriaRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.paragraph(),
      });
      productosList.push(producto);
    }

    categoria = await categoriaRepository.save({
      nombre: faker.commerce.department(),
      codigo: faker.string.alphanumeric(5),
      productos: productosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCategoria should add a product to a category', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.commerce.department(),
      codigo: faker.string.alphanumeric(5),
    });

    const result: CategoriaEntity = await service.addProductoCategoria(
      newCategoria.id,
      newProducto.id,
    );

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre);
    expect(result.productos[0].descripcion).toBe(newProducto.descripcion);
    expect(result.productos[0].historia).toBe(newProducto.historia);
  });

  it('addProductoCategoria should throw an exception for an invalid product', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.commerce.department(),
      codigo: faker.string.alphanumeric(5),
    });

    await expect(() =>
      service.addProductoCategoria(newCategoria.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addProductoCategoria should throw an exception for an invalid category', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    await expect(() =>
      service.addProductoCategoria('0', newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('findProductoByCategoriaIdProductoId should return product by category', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity =
      await service.findProductoByCategoriaIdProductoId(
        categoria.id,
        producto.id,
      );

    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.descripcion).toBe(producto.descripcion);
    expect(storedProducto.historia).toBe(producto.historia);
  });

  it('findProductoByCategoriaIdProductoId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findProductoByCategoriaIdProductoId(categoria.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findProductoByCategoriaIdProductoId should throw an exception for an invalid category', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.findProductoByCategoriaIdProductoId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('findProductosByCategoriaId should return products by category', async () => {
    const productos: ProductoEntity[] =
      await service.findProductosByCategoriaId(categoria.id);
    expect(productos.length).toBe(5);
  });

  it('findProductosByCategoriaId should throw an exception for an invalid category', async () => {
    await expect(() =>
      service.findProductosByCategoriaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('associateProductosCategoria should update product list for a category', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    const updatedCategoria: CategoriaEntity =
      await service.associateProductosCategoria(categoria.id, [newProducto]);
    expect(updatedCategoria.productos.length).toBe(1);
    expect(updatedCategoria.productos[0].nombre).toBe(newProducto.nombre);
  });

  it('associateProductosCategoria should throw an exception for an invalid category', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    await expect(() =>
      service.associateProductosCategoria('0', [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('associateProductosCategoria should throw an exception for an invalid product', async () => {
    const invalidProducto: ProductoEntity = productosList[0];
    invalidProducto.id = '0';

    await expect(() =>
      service.associateProductosCategoria(categoria.id, [invalidProducto]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductoCategoria should remove a product from a category', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.deleteProductoCategoria(categoria.id, producto.id);

    const storedCategoria: CategoriaEntity = await categoriaRepository.findOne({
      where: { id: categoria.id },
      relations: ['productos'],
    });

    const deletedProducto: ProductoEntity = storedCategoria.productos.find(
      (p) => p.id === producto.id,
    );

    expect(deletedProducto).toBeUndefined();
  });

  it('deleteProductoCategoria should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.deleteProductoCategoria(categoria.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductoCategoria should throw an exception for an invalid category', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.deleteProductoCategoria('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('deleteProductoCategoria should throw an exception for a product not associated with the category', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    await expect(() =>
      service.deleteProductoCategoria(categoria.id, newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated with the category',
    );
  });
});
