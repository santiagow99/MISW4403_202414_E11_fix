import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [RestauranteService],
  imports: [TypeOrmModule.forFeature([RestauranteEntity])],
  exports: [RestauranteService],
})
export class RestauranteModule {}
