import { Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteController } from './restaurante.controller';

@Module({
  providers: [RestauranteService],
  imports: [TypeOrmModule.forFeature([RestauranteEntity])],
  exports: [RestauranteService],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
