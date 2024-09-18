import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from './categoria.entity';

@Module({
  providers: [CategoriaService],
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  exports: [CategoriaService],
})
export class CategoriaModule {}
