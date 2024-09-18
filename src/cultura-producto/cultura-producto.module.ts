import { Module } from '@nestjs/common';
import { CulturaProductoService } from './cultura-producto.service';

@Module({
  providers: [CulturaProductoService]
})
export class CulturaProductoModule {}
