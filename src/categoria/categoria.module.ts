import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaController } from './categoria.controller';

@Module({
  providers: [CategoriaService],
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  exports: [CategoriaService],
  controllers: [CategoriaController],
})
export class CategoriaModule {}
