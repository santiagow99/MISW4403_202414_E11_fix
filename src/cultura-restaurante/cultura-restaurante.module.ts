import { Module } from '@nestjs/common';
import { CulturaRestauranteService } from './cultura-restaurante.service';

@Module({
  providers: [CulturaRestauranteService]
})
export class CulturaRestauranteModule {}
