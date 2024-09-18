import { Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';

@Module({
  providers: [CiudadService],
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  exports: [CiudadService],
})
export class CiudadModule {}
