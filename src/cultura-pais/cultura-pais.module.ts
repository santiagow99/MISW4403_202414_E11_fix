import { Module } from '@nestjs/common';
import { CulturaPaisService } from './cultura-pais.service';

@Module({
  providers: [CulturaPaisService]
})
export class CulturaPaisModule {}
