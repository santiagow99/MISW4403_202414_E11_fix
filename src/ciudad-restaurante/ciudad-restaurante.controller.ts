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
import { CiudadRestauranteService } from './ciudad-restaurante.service';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { RestauranteDto } from 'src/restaurante/restaurante.dto/restaurante.dto';

@Controller('ciudad-restaurante')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadRestauranteController {
  constructor(
    private readonly ciudadRestauranteService: CiudadRestauranteService,
  ) {}

  @Post(':ciudadId/restaurantes/:restauranteId')
  async addRestauranteCiudad(
    @Param('ciudadId') ciudadId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.ciudadRestauranteService.addRestauranteCiudad(
      ciudadId,
      restauranteId,
    );
  }

  @Get(':ciudadId/restaurantes/:restauranteId')
  async findRestauranteByCiudadIdRestauranteId(
    @Param('ciudadId') ciudadId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.ciudadRestauranteService.findRestauranteByCiudadIdRestauranteId(
      ciudadId,
      restauranteId,
    );
  }

  @Get(':ciudadId/restaurantes')
  async findRestaurantesByCiudadId(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadRestauranteService.findRestaurantesByCiudadId(
      ciudadId,
    );
  }

  @Put(':ciudadId/restaurantes')
  async associateRestaurantesCiudad(
    @Param('ciudadId') ciudadId: string,
    @Body() restaurantesDto: RestauranteDto[],
  ) {
    const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto);
    return await this.ciudadRestauranteService.associateRestaurantesCiudad(
      ciudadId,
      restaurantes,
    );
  }

  @Delete(':ciudadId/restaurantes/:restauranteId')
  @HttpCode(204)
  async deleteRestauranteCiudad(
    @Param('ciudadId') ciudadId: string,
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.ciudadRestauranteService.deleteRestauranteCiudad(
      ciudadId,
      restauranteId,
    );
  }
}
