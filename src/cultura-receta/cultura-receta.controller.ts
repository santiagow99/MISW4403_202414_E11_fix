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
import { CulturaRecetaService } from './cultura-receta.service';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { RecetaDto } from 'src/receta/receta.dto/receta.dto';

@Controller('cultura-receta')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRecetaController {
  constructor(private readonly culturaRecetaService: CulturaRecetaService) {}

  @Post(':culturaId/recetas/:recetaId')
  async addRecetaCultura(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.addRecetaCultura(
      culturaId,
      recetaId,
    );
  }

  @Get(':culturaId/recetas/:recetaId')
  async findRecetaByCulturaIdRecetaId(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.findRecetaByCulturaIdRecetaId(
      culturaId,
      recetaId,
    );
  }

  @Get(':culturaId/recetas')
  async findRecetasByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaRecetaService.findRecetasByCulturaId(culturaId);
  }

  @Put(':culturaId/recetas')
  async associateRecetasCultura(
    @Param('culturaId') culturaId: string,
    @Body() recetasDto: RecetaDto[],
  ) {
    const recetas = plainToInstance(RecetaEntity, recetasDto);
    return await this.culturaRecetaService.associateRecetasCultura(
      culturaId,
      recetas,
    );
  }

  @Delete(':culturaId/recetas/:recetaId')
  @HttpCode(204)
  async deleteRecetaCultura(
    @Param('culturaId') culturaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.culturaRecetaService.deleteRecetaCultura(
      culturaId,
      recetaId,
    );
  }
}
