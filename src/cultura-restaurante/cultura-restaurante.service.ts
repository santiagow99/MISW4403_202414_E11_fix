import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CulturaRestauranteService {
  constructor(
    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,

    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) {}

  // Add a restaurant to a culture
  async addRestauranteCultura(
    culturaId: string,
    restauranteId: string,
  ): Promise<CulturaEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['restaurantes'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    cultura.restaurantes = [...cultura.restaurantes, restaurante];
    return await this.culturaRepository.save(cultura);
  }

  // Find a specific restaurant by culture id and restaurant id
  async findRestauranteByCulturaIdRestauranteId(
    culturaId: string,
    restauranteId: string,
  ): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['restaurantes'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(
      (e) => e.id === restaurante.id,
    );
    if (!culturaRestaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return culturaRestaurante;
  }

  // Find all restaurants associated with a culture
  async findRestaurantesByCulturaId(
    culturaId: string,
  ): Promise<RestauranteEntity[]> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['restaurantes'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return cultura.restaurantes;
  }

  // Associate multiple restaurants with a culture
  async associateRestaurantesCultura(
    culturaId: string,
    restaurantes: RestauranteEntity[],
  ): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['restaurantes'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    for (let i = 0; i < restaurantes.length; i++) {
      const restaurante: RestauranteEntity =
        await this.restauranteRepository.findOne({
          where: { id: restaurantes[i].id },
        });
      if (!restaurante) {
        throw new BusinessLogicException(
          'The restaurant with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }

    cultura.restaurantes = restaurantes;
    return await this.culturaRepository.save(cultura);
  }

  // Remove a restaurant from a culture
  async deleteRestauranteCultura(culturaId: string, restauranteId: string) {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: restauranteId },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['restaurantes'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(
      (e) => e.id === restaurante.id,
    );
    if (!culturaRestaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    cultura.restaurantes = cultura.restaurantes.filter(
      (e) => e.id !== restauranteId,
    );
    await this.culturaRepository.save(cultura);
  }
}
