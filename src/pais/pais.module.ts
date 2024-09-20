import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisController } from './pais.controller';

@Module({
  providers: [PaisService],
  imports: [TypeOrmModule.forFeature([PaisEntity])],
  exports: [PaisService],
  controllers: [PaisController],
})
export class PaisModule {}
