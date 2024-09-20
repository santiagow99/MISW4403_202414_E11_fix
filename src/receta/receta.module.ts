import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaController } from './receta.controller';

@Module({
  providers: [RecetaService],
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
  exports: [RecetaService],
  controllers: [RecetaController],
})
export class RecetaModule {}
