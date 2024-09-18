import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [RecetaService],
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
  exports: [RecetaService],
})
export class RecetaModule {}
