import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';

@Injectable()
export class RestauranteService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) {}

  // Find all restaurants with their related cultures and city
  async findAll(): Promise<RestauranteEntity[]> {
    return await this.restauranteRepository.find({
      relations: ['culturas', 'ciudad'], // Updated relation 'ciudad'
    });
  }

  // Find one restaurant by ID, including cultures and city
  async findOne(id: string): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id },
        relations: ['culturas', 'ciudad'], // Updated relation 'ciudad'
      });
    if (!restaurante)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return restaurante;
  }

  // Create a new restaurant
  async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    return await this.restauranteRepository.save(restaurante);
  }

  // Update a restaurant by ID
  async update(
    id: string,
    restaurante: RestauranteEntity,
  ): Promise<RestauranteEntity> {
    const persistedRestaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({ where: { id } });
    if (!persistedRestaurante)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.restauranteRepository.save({
      ...persistedRestaurante,
      ...restaurante,
    });
  }

  // Delete a restaurant by ID
  async delete(id: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({ where: { id } });
    if (!restaurante)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.restauranteRepository.remove(restaurante);
  }
}
