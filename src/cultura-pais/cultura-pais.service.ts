import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CulturaPaisService {
  constructor(
    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,

    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,
  ) {}

  // Add a country to a culture
  async addPaisCultura(
    culturaId: string,
    paisId: string,
  ): Promise<CulturaEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['paises'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    cultura.paises = [...cultura.paises, pais];
    return await this.culturaRepository.save(cultura);
  }

  // Find a specific country by culture id and country id
  async findPaisByCulturaIdPaisId(
    culturaId: string,
    paisId: string,
  ): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['paises'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaPais: PaisEntity = cultura.paises.find(
      (e) => e.id === pais.id,
    );

    if (!culturaPais) {
      throw new BusinessLogicException(
        'The country with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return culturaPais;
  }

  // Find all countries associated with a culture
  async findPaisesByCulturaId(culturaId: string): Promise<PaisEntity[]> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['paises'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return cultura.paises;
  }

  // Associate multiple countries to a culture
  async associatePaisesCultura(
    culturaId: string,
    paises: PaisEntity[],
  ): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['paises'],
    });

    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    for (let i = 0; i < paises.length; i++) {
      const pais: PaisEntity = await this.paisRepository.findOne({
        where: { id: paises[i].id },
      });
      if (!pais) {
        throw new BusinessLogicException(
          'The country with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }

    cultura.paises = paises;
    return await this.culturaRepository.save(cultura);
  }

  // Remove a country from a culture
  async deletePaisCultura(culturaId: string, paisId: string) {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id: paisId },
    });
    if (!pais) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['paises'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaPais: PaisEntity = cultura.paises.find(
      (e) => e.id === pais.id,
    );

    if (!culturaPais) {
      throw new BusinessLogicException(
        'The country with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    cultura.paises = cultura.paises.filter((e) => e.id !== paisId);
    await this.culturaRepository.save(cultura);
  }
}
