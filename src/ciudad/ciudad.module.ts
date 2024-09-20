import { Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CiudadController } from './ciudad.controller';

@Module({
  providers: [CiudadService],
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  exports: [CiudadService],
  controllers: [CiudadController],
})
export class CiudadModule {}
