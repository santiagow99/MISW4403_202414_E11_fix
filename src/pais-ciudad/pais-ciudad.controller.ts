/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaisCiudadService } from './pais-ciudad.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadDto } from 'src/ciudad/ciudad.dto/ciudad.dto';

@Controller('pais-ciudad')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisCiudadController {
  constructor(private readonly paisCiudadService: PaisCiudadService) {}

  @Post(':paisId/ciudades/:ciudadId')
  async addCiudadToPais(
    @Param('paisId') paisId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    return await this.paisCiudadService.addCiudadToPais(paisId, ciudadId);
  }

  @Get(':paisId/ciudades/:ciudadId')
  async findCiudadByPaisIdCiudadId(
    @Param('paisId') paisId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    return await this.paisCiudadService.findCiudadByPaisIdCiudadId(
      paisId,
      ciudadId,
    );
  }

  @Get(':paisId/ciudades')
  async findCiudadesByPaisId(@Param('paisId') paisId: string) {
    return await this.paisCiudadService.findCiudadesByPaisId(paisId);
  }

  @Put(':paisId/ciudades')
  async associateCiudadesToPais(
    @Param('paisId') paisId: string,
    @Body() ciudadesDto: CiudadDto[],
  ) {
    const ciudades = plainToInstance(CiudadEntity, ciudadesDto);
    return await this.paisCiudadService.associateCiudadesToPais(
      paisId,
      ciudades,
    );
  }

  @Delete(':paisId/ciudades/:ciudadId')
  @HttpCode(204)
  async deleteCiudadFromPais(
    @Param('paisId') paisId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    return await this.paisCiudadService.deleteCiudadFromPais(paisId, ciudadId);
  }
}
