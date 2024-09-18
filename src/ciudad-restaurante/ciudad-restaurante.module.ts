import { Module } from '@nestjs/common';
import { CiudadRestauranteService } from './ciudad-restaurante.service';

@Module({
  providers: [CiudadRestauranteService]
})
export class CiudadRestauranteModule {}
