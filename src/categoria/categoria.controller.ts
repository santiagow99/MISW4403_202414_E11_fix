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
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';
import { CategoriaDto } from './categoria.dto/categoria.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  async findAll() {
    return await this.categoriaService.findAll();
  }

  @Get(':categoriaId')
  async findOne(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaService.findOne(categoriaId);
  }

  @Post()
  async create(@Body() categoriaDto: CategoriaDto) {
    const categoria: CategoriaEntity = plainToInstance(
      CategoriaEntity,
      categoriaDto,
    );
    return await this.categoriaService.create(categoria);
  }

  @Put(':categoriaId')
  async update(
    @Param('categoriaId') categoriaId: string,
    @Body() categoriaDto: CategoriaDto,
  ) {
    const categoria: CategoriaEntity = plainToInstance(
      CategoriaEntity,
      categoriaDto,
    );
    return await this.categoriaService.update(categoriaId, categoria);
  }

  @Delete(':categoriaId')
  @HttpCode(204)
  async delete(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaService.delete(categoriaId);
  }
}
