import { Module } from '@nestjs/common';
import { CulturaRecetaService } from './cultura-receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaRecetaController } from './cultura-receta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, RecetaEntity])],
  providers: [CulturaRecetaService],
  exports: [CulturaRecetaService],
  controllers: [CulturaRecetaController],
})
export class CulturaRecetaModule {}
