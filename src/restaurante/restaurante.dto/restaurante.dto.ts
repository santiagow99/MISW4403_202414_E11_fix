/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';

export class RestauranteDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsOptional()
  readonly estrellasMichelin?: string;

  @IsDateString()
  @IsOptional()
  readonly fechaConsecuencion?: string;
}
