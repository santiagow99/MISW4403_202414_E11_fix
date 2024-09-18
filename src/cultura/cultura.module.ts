import { Module } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';

@Module({
  providers: [CulturaService],
  imports: [TypeOrmModule.forFeature([CulturaEntity])],
  exports: [CulturaService],
})
export class CulturaModule {}
