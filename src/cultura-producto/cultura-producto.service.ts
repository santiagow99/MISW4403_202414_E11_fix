import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CulturaProductoService {
  constructor(
    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addProductoCultura(
    culturaId: string,
    productoId: string,
  ): Promise<CulturaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['productos'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    cultura.productos = [...cultura.productos, producto];
    return await this.culturaRepository.save(cultura);
  }

  async findProductoByCulturaIdProductoId(
    culturaId: string,
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

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['productos'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaProducto: ProductoEntity = cultura.productos.find(
      (e) => e.id === producto.id,
    );
    if (!culturaProducto) {
      throw new BusinessLogicException(
        'The product with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return culturaProducto;
  }

  async findProductosByCulturaId(culturaId: string): Promise<ProductoEntity[]> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['productos'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return cultura.productos;
  }

  async associateProductosCultura(
    culturaId: string,
    productos: ProductoEntity[],
  ): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['productos'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
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

    cultura.productos = productos;
    return await this.culturaRepository.save(cultura);
  }

  async deleteProductoCultura(culturaId: string, productoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['productos'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaProducto: ProductoEntity = cultura.productos.find(
      (e) => e.id === producto.id,
    );
    if (!culturaProducto) {
      throw new BusinessLogicException(
        'The product with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    cultura.productos = cultura.productos.filter((e) => e.id !== productoId);
    await this.culturaRepository.save(cultura);
  }
}
