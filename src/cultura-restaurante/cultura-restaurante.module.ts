import { Module } from '@nestjs/common';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, RestauranteEntity])],
  providers: [CulturaRestauranteService],
  exports: [CulturaRestauranteService],
})
export class CulturaRestauranteModule {}
