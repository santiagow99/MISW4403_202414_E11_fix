import { Module } from '@nestjs/common';
import { CategoriaProductoService } from './categoria-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import { CategoriaEntity } from 'src/categoria/categoria.entity';
import { CategoriaService } from 'src/categoria/categoria.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, CategoriaEntity])],
  providers: [CategoriaProductoService],
  exports: [CategoriaProductoService],
})
export class CategoriaProductoModule {}
