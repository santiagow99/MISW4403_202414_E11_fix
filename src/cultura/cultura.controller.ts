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
import { CulturaEntity } from './cultura.entity';
import { CulturaService } from './cultura.service';
import { CulturaDto } from './cultura.dto/cultura.dto';

@Controller('culturas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaController {
  constructor(private readonly culturaService: CulturaService) {}

  @Get()
  async findAll() {
    return await this.culturaService.findAll();
  }

  @Get(':culturaId')
  async findOne(@Param('culturaId') culturaId: string) {
    return await this.culturaService.findOne(culturaId);
  }

  @Post()
  async create(@Body() culturaDto: CulturaDto) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.create(cultura);
  }

  @Put(':culturaId')
  async update(
    @Param('culturaId') culturaId: string,
    @Body() culturaDto: CulturaDto,
  ) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.update(culturaId, cultura);
  }

  @Delete(':culturaId')
  @HttpCode(204)
  async delete(@Param('culturaId') culturaId: string) {
    return await this.culturaService.delete(culturaId);
  }
}
