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
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { RestauranteDto } from 'src/restaurante/restaurante.dto/restaurante.dto';

@Controller('cultura-restaurante')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRestauranteController {
  constructor(
    private readonly culturaRestauranteService: CulturaRestauranteService,
  ) {}

  @Post(':culturaId/restaurantes/:restauranteId')
  async addRestauranteCultura(
    @Param('culturaId') culturaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaRestauranteService.addRestauranteCultura(
      culturaId,
      restauranteId,
    );
  }

  @Get(':culturaId/restaurantes/:restauranteId')
  async findRestauranteByCulturaIdRestauranteId(
    @Param('culturaId') culturaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(
      culturaId,
      restauranteId,
    );
  }

  @Get(':culturaId/restaurantes')
  async findRestaurantesByCulturaId(@Param('culturaId') culturaId: string) {
    return await this.culturaRestauranteService.findRestaurantesByCulturaId(
      culturaId,
    );
  }

  @Put(':culturaId/restaurantes')
  async associateRestaurantesCultura(
    @Param('culturaId') culturaId: string,
    @Body() restaurantesDto: RestauranteDto[],
  ) {
    const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto);
    return await this.culturaRestauranteService.associateRestaurantesCultura(
      culturaId,
      restaurantes,
    );
  }

  @Delete(':culturaId/restaurantes/:restauranteId')
  @HttpCode(204)
  async deleteRestauranteCultura(
    @Param('culturaId') culturaId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.culturaRestauranteService.deleteRestauranteCultura(
      culturaId,
      restauranteId,
    );
  }
}
