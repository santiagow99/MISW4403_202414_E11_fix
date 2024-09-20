import { Module } from '@nestjs/common';
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadRestauranteController } from './ciudad-restaurante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, RestauranteEntity])],
  providers: [CiudadRestauranteService],
  exports: [CiudadRestauranteService],
  controllers: [CiudadRestauranteController],
})
export class CiudadRestauranteModule {}
