import { Module } from '@nestjs/common';
import { CategoriaProductoService } from './categoria-producto.service';

@Module({
  providers: [CategoriaProductoService]
})
export class CategoriaProductoModule {}
