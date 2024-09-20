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
import { CategoriaProductoService } from './categoria-producto.service';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ProductoDto } from 'src/producto/producto.dto/producto.dto';

@Controller('categoria-producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaProductoController {
  constructor(
    private readonly categoriaProductoService: CategoriaProductoService,
  ) {}

  @Post(':categoriaId/productos/:productoId')
  async addProductoCategoria(
    @Param('categoriaId') categoriaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.categoriaProductoService.addProductoCategoria(
      categoriaId,
      productoId,
    );
  }

  @Get(':categoriaId/productos/:productoId')
  async findProductoByCategoriaIdProductoId(
    @Param('categoriaId') categoriaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.categoriaProductoService.findProductoByCategoriaIdProductoId(
      categoriaId,
      productoId,
    );
  }

  @Get(':categoriaId/productos')
  async findProductosByCategoriaId(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaProductoService.findProductosByCategoriaId(
      categoriaId,
    );
  }

  @Put(':categoriaId/productos')
  async associateProductosCategoria(
    @Param('categoriaId') categoriaId: string,
    @Body() productosDto: ProductoDto[],
  ) {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return await this.categoriaProductoService.associateProductosCategoria(
      categoriaId,
      productos,
    );
  }

  @Delete(':categoriaId/productos/:productoId')
  @HttpCode(204)
  async deleteProductoCategoria(
    @Param('categoriaId') categoriaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.categoriaProductoService.deleteProductoCategoria(
      categoriaId,
      productoId,
    );
  }
}
