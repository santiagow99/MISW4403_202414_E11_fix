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
import { CulturaProductoService } from './cultura-producto.service';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ProductoDto } from 'src/producto/producto.dto/producto.dto';

@Controller('cultura-producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaProductoController {
  constructor(
    private readonly culturaProductoService: CulturaProductoService,
  ) {}

  @Post(':culturaId/productos/:productoId')
  async addProductoCultura(
    @Param('culturaId') culturaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaProductoService.addProductoCultura(
      culturaId,
      productoId,
    );
  }

  @Get(':culturaId/productos/:productoId')
  async findProductoByCulturaIdProductoId(
    @Param('culturaId') culturaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaProductoService.findProductoByCulturaIdProductoId(
      culturaId,
      productoId,
    );
  }

  @Get(':culturaId/productos')
  async findProductosByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaProductoService.findProductosByCulturaId(
      culturaId,
    );
  }

  @Put(':culturaId/productos')
  async associateProductosCultura(
    @Param('culturaId') culturaId: string,
    @Body() productosDto: ProductoDto[],
  ) {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return await this.culturaProductoService.associateProductosCultura(
      culturaId,
      productos,
    );
  }

  @Delete(':culturaId/productos/:productoId')
  @HttpCode(204)
  async deleteProductoCultura(
    @Param('culturaId') culturaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.culturaProductoService.deleteProductoCultura(
      culturaId,
      productoId,
    );
  }
}
