import { Module } from '@nestjs/common';
import { CulturaProductoService } from './cultura-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, ProductoEntity])],
  providers: [CulturaProductoService],
  exports: [CulturaProductoService],
})
export class CulturaProductoModule {}
