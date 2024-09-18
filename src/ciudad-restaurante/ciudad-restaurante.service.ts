import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CiudadRestauranteService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,

    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
  ) {}

  // Add a restaurant to a city
  async addRestauranteCiudad(
    ciudadId: string,
    restauranteId: string,
  ): Promise<CiudadEntity> {
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

    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    ciudad.restaurantes = [...ciudad.restaurantes, restaurante];
    return await this.ciudadRepository.save(ciudad);
  }

  // Find a specific restaurant by city id and restaurant id
  async findRestauranteByCiudadIdRestauranteId(
    ciudadId: string,
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

    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const ciudadRestaurante: RestauranteEntity = ciudad.restaurantes.find(
      (e) => e.id === restaurante.id,
    );

    if (!ciudadRestaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated with the city',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return ciudadRestaurante;
  }

  // Find all restaurants associated with a city
  async findRestaurantesByCiudadId(
    ciudadId: string,
  ): Promise<RestauranteEntity[]> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return ciudad.restaurantes;
  }

  // Associate multiple restaurants to a city
  async associateRestaurantesCiudad(
    ciudadId: string,
    restaurantes: RestauranteEntity[],
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
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

    ciudad.restaurantes = restaurantes;
    return await this.ciudadRepository.save(ciudad);
  }

  // Remove a restaurant from a city
  async deleteRestauranteCiudad(ciudadId: string, restauranteId: string) {
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

    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
      relations: ['restaurantes'],
    });
    if (!ciudad) {
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const ciudadRestaurante: RestauranteEntity = ciudad.restaurantes.find(
      (e) => e.id === restaurante.id,
    );

    if (!ciudadRestaurante) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated with the city',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    ciudad.restaurantes = ciudad.restaurantes.filter(
      (e) => e.id !== restauranteId,
    );
    await this.ciudadRepository.save(ciudad);
  }
}
