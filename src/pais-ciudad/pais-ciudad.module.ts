import { Module } from '@nestjs/common';
import { PaisCiudadService } from './pais-ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity, CiudadEntity])],
  providers: [PaisCiudadService],
  exports: [PaisCiudadService],
})
export class PaisCiudadModule {}
