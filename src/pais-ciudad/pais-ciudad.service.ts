/* archivo: src/pais-ciudad/pais-ciudad.service.ts */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class PaisCiudadService {
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  // Add a city to a country
  async addCiudadToPais(paisId: string, ciudadId: string): Promise<PaisEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    pais.ciudades = [...pais.ciudades, ciudad];
    return await this.paisRepository.save(pais);
  }

  // Find a specific city by country id and city id
  async findCiudadByPaisIdCiudadId(
    paisId: string,
    ciudadId: string,
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const paisCiudad: CiudadEntity = pais.ciudades.find(
      (e) => e.id === ciudad.id,
    );
    if (!paisCiudad)
      throw new BusinessLogicException(
        'The city with the given id is not associated with the country',
        BusinessError.PRECONDITION_FAILED,
      );

    return paisCiudad;
  }

  // Find all cities associated with a country
  async findCiudadesByPaisId(paisId: string): Promise<CiudadEntity[]> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return pais.ciudades;
  }

  // Associate multiple cities with a country
  async associateCiudadesToPais(
    paisId: string,
    ciudades: CiudadEntity[],
  ): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < ciudades.length; i++) {
      const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
        where: { id: ciudades[i].id },
      });
      if (!ciudad)
        throw new BusinessLogicException(
          'The city with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    pais.ciudades = ciudades;
    return await this.paisRepository.save(pais);
  }

  // Remove a city from a country
  async deleteCiudadFromPais(paisId: string, ciudadId: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
      relations: ['ciudades'],
    });
    if (!pais)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const paisCiudad: CiudadEntity = pais.ciudades.find(
      (e) => e.id === ciudad.id,
    );
    if (!paisCiudad)
      throw new BusinessLogicException(
        'The city with the given id is not associated with the country',
        BusinessError.PRECONDITION_FAILED,
      );

    pais.ciudades = pais.ciudades.filter((e) => e.id !== ciudadId);
    await this.paisRepository.save(pais);
  }
}
