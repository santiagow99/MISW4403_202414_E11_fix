import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CulturaRecetaService {
  constructor(
    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,
  ) {}

  // Add a recipe to a culture
  async addRecetaCultura(
    culturaId: string,
    recetaId: string,
  ): Promise<CulturaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    cultura.recetas = [...cultura.recetas, receta];
    return await this.culturaRepository.save(cultura);
  }

  // Find a specific recipe by culture id and recipe id
  async findRecetaByCulturaIdRecetaId(
    culturaId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaReceta: RecetaEntity = cultura.recetas.find(
      (e) => e.id === receta.id,
    );
    if (!culturaReceta) {
      throw new BusinessLogicException(
        'The recipe with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return culturaReceta;
  }

  // Find all recipes associated with a culture
  async findRecetasByCulturaId(culturaId: string): Promise<RecetaEntity[]> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return cultura.recetas;
  }

  // Associate multiple recipes with a culture
  async associateRecetasCultura(
    culturaId: string,
    recetas: RecetaEntity[],
  ): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    for (let i = 0; i < recetas.length; i++) {
      const receta: RecetaEntity = await this.recetaRepository.findOne({
        where: { id: recetas[i].id },
      });
      if (!receta) {
        throw new BusinessLogicException(
          'The recipe with the given id was not found',
          BusinessError.NOT_FOUND,
        );
      }
    }

    cultura.recetas = recetas;
    return await this.culturaRepository.save(cultura);
  }

  // Remove a recipe from a culture
  async deleteRecetaCultura(culturaId: string, recetaId: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id: culturaId },
      relations: ['recetas'],
    });
    if (!cultura) {
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const culturaReceta: RecetaEntity = cultura.recetas.find(
      (e) => e.id === receta.id,
    );
    if (!culturaReceta) {
      throw new BusinessLogicException(
        'The recipe with the given id is not associated with the culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    cultura.recetas = cultura.recetas.filter((e) => e.id !== recetaId);
    await this.culturaRepository.save(cultura);
  }
}
