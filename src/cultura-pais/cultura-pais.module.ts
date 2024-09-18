import { Module } from '@nestjs/common';
import { CulturaPaisService } from './cultura-pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, PaisEntity])],
  providers: [CulturaPaisService],
  exports: [CulturaPaisService],
})
export class CulturaPaisModule {}
