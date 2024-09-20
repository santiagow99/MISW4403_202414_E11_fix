/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaProductoService } from './cultura-producto.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { faker } from '@faker-js/faker';

describe('CulturaProductoService', () => {
  let service: CulturaProductoService;
  let culturaRepository: Repository<CulturaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let cultura: CulturaEntity;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaProductoService],
    }).compile();

    service = module.get<CulturaProductoService>(CulturaProductoService);
    culturaRepository = module.get<Repository<CulturaEntity>>(
      getRepositoryToken(CulturaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    culturaRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.commerce.productName(),
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.paragraph(),
      });
      productosList.push(producto);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
      productos: productosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCultura should add a product to a culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    const result: CulturaEntity = await service.addProductoCultura(
      newCultura.id,
      newProducto.id,
    );

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre);
    expect(result.productos[0].descripcion).toBe(newProducto.descripcion);
    expect(result.productos[0].historia).toBe(newProducto.historia);
  });

  it('addProductoCultura should throw an exception for an invalid product', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.word(),
      descripcion: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addProductoCultura(newCultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addProductoCultura should throw an exception for an invalid culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    await expect(() =>
      service.addProductoCultura('0', newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findProductoByCulturaIdProductoId should return a product by culture', async () => {
    const producto: ProductoEntity = productosList[0];
    const storedProducto: ProductoEntity =
      await service.findProductoByCulturaIdProductoId(cultura.id, producto.id);

    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.descripcion).toBe(producto.descripcion);
    expect(storedProducto.historia).toBe(producto.historia);
  });

  it('findProductoByCulturaIdProductoId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findProductoByCulturaIdProductoId(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findProductoByCulturaIdProductoId should throw an exception for an invalid culture', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.findProductoByCulturaIdProductoId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('findProductosByCulturaId should return all products by culture', async () => {
    const productos: ProductoEntity[] = await service.findProductosByCulturaId(
      cultura.id,
    );
    expect(productos.length).toBe(5);
  });

  it('findProductosByCulturaId should throw an exception for an invalid culture', async () => {
    await expect(() =>
      service.findProductosByCulturaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateProductosCultura should update the list of products for a culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    const updatedCultura: CulturaEntity =
      await service.associateProductosCultura(cultura.id, [newProducto]);

    expect(updatedCultura.productos.length).toBe(1);
    expect(updatedCultura.productos[0].nombre).toBe(newProducto.nombre);
  });

  it('associateProductosCultura should throw an exception for an invalid culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    await expect(() =>
      service.associateProductosCultura('0', [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('associateProductosCultura should throw an exception for an invalid product', async () => {
    const invalidProducto: ProductoEntity = productosList[0];
    invalidProducto.id = '0';

    await expect(() =>
      service.associateProductosCultura(cultura.id, [invalidProducto]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductoCultura should remove a product from a culture', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.deleteProductoCultura(cultura.id, producto.id);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({
      where: { id: cultura.id },
      relations: ['productos'],
    });

    const deletedProducto: ProductoEntity = storedCultura.productos.find(
      (p) => p.id === producto.id,
    );

    expect(deletedProducto).toBeUndefined();
  });

  it('deleteProductoCultura should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.deleteProductoCultura(cultura.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductoCultura should throw an exception for an invalid culture', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() =>
      service.deleteProductoCultura('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'The culture with the given id was not found',
    );
  });

  it('deleteProductoCultura should throw an exception for a product not associated with the culture', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.commerce.productName(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.paragraph(),
    });

    await expect(() =>
      service.deleteProductoCultura(cultura.id, newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated with the culture',
    );
  });
});
