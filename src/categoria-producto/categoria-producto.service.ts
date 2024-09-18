import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { ProductoEntity } from '../producto/producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CategoriaProductoService {
  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  // Add a product to a category
  async addProductoCategoria(
    categoriaId: string,
    productoId: string,
  ): Promise<CategoriaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });
    if (!categoria) {
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    categoria.productos = [...categoria.productos, producto];
    return await this.categoriaRepository.save(categoria);
  }

  // Find a specific product by category id and product id
  async findProductoByCategoriaIdProductoId(
    categoriaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });
    if (!categoria) {
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const categoriaProducto: ProductoEntity = categoria.productos.find(
      (e) => e.id === producto.id,
    );

    if (!categoriaProducto) {
      throw new BusinessLogicException(
        'The product with the given id is not associated with the category',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return categoriaProducto;
  }

  // Find all products associated with a category
  async findProductosByCategoriaId(
    categoriaId: string,
  ): Promise<ProductoEntity[]> {
    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });
    if (!categoria) {
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return categoria.productos;
  }

  // Associate multiple products to a category
  async associateProductosCategoria(
    categoriaId: string,
    productos: ProductoEntity[],
  ): Promise<CategoriaEntity> {
    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });

    if (!categoria) {
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    for (let i = 0; i < productos.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: productos[i].id },
      });
      if (!producto) {
        throw new BusinessLogicException(
          'The product with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }

    categoria.productos = productos;
    return await this.categoriaRepository.save(categoria);
  }

  // Remove a product from a category
  async deleteProductoCategoria(categoriaId: string, productoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });
    if (!categoria) {
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const categoriaProducto: ProductoEntity = categoria.productos.find(
      (e) => e.id === producto.id,
    );

    if (!categoriaProducto) {
      throw new BusinessLogicException(
        'The product with the given id is not associated with the category',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    categoria.productos = categoria.productos.filter(
      (e) => e.id !== productoId,
    );
    await this.categoriaRepository.save(categoria);
  }
}
