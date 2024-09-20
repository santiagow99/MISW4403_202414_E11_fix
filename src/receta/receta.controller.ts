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
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { RecetaDto } from './receta.dto/receta.dto';

@Controller('receta')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Get()
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Get(':recetaId')
  async findOne(@Param('recetaId') recetaId: string) {
    return await this.recetaService.findOne(recetaId);
  }

  @Post()
  async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
  }

  @Put(':recetaId')
  async update(
    @Param('recetaId') recetaId: string,
    @Body() recetaDto: RecetaDto,
  ) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.update(recetaId, receta);
  }

  @Delete(':recetaId')
  @HttpCode(204)
  async delete(@Param('recetaId') recetaId: string) {
    return await this.recetaService.delete(recetaId);
  }
}
