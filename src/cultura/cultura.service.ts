import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaEntity } from './cultura.entity';

@Injectable()
export class CulturaService {
  constructor(
    @InjectRepository(CulturaEntity)
    private readonly culturaRepository: Repository<CulturaEntity>,
  ) {}

  async findAll(): Promise<CulturaEntity[]> {
    return await this.culturaRepository.find({
      relations: ['recetas', 'paises', 'productos', 'restaurantes'],
    });
  }

  async findOne(id: string): Promise<CulturaEntity> {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id },
      relations: ['recetas', 'paises', 'productos', 'restaurantes'],
    });
    if (!cultura)
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return cultura;
  }

  async create(cultura: CulturaEntity): Promise<CulturaEntity> {
    return await this.culturaRepository.save(cultura);
  }

  async update(id: string, cultura: CulturaEntity): Promise<CulturaEntity> {
    const persistedCultura: CulturaEntity =
      await this.culturaRepository.findOne({ where: { id } });
    if (!persistedCultura)
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.culturaRepository.save({
      ...persistedCultura,
      ...cultura,
    });
  }

  async delete(id: string) {
    const cultura: CulturaEntity = await this.culturaRepository.findOne({
      where: { id },
    });
    if (!cultura)
      throw new BusinessLogicException(
        'The culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.culturaRepository.remove(cultura);
  }
}
