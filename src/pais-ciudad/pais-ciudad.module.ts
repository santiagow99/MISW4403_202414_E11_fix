import { Module } from '@nestjs/common';
import { PaisCiudadService } from './pais-ciudad.service';

@Module({
  providers: [PaisCiudadService]
})
export class PaisCiudadModule {}
