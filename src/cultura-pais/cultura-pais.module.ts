import { Module } from '@nestjs/common';
import { CulturaPaisService } from './cultura-pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaPaisController } from './cultura-pais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, PaisEntity])],
  providers: [CulturaPaisService],
  exports: [CulturaPaisService],
  controllers: [CulturaPaisController],
})
export class CulturaPaisModule {}
