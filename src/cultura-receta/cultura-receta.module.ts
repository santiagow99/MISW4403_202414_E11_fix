import { Module } from '@nestjs/common';
import { CulturaRecetaService } from './cultura-receta.service';

@Module({
  providers: [CulturaRecetaService]
})
export class CulturaRecetaModule {}
