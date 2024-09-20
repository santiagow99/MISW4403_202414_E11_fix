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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisDto } from './pais.dto/pais.dto';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Get()
  async findAll() {
    return await this.paisService.findAll();
  }

  @Get(':paisId')
  async findOne(@Param('paisId') paisId: string) {
    return await this.paisService.findOne(paisId);
  }

  @Post()
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @Put(':paisId')
  async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisId, pais);
  }

  @Delete(':paisId')
  @HttpCode(204)
  async delete(@Param('paisId') paisId: string) {
    return await this.paisService.delete(paisId);
  }
}
