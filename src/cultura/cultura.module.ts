import { Module } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';
import { CulturaController } from './cultura.controller';

@Module({
  providers: [CulturaService],
  imports: [TypeOrmModule.forFeature([CulturaEntity])],
  exports: [CulturaService],
  controllers: [CulturaController],
})
export class CulturaModule {}
