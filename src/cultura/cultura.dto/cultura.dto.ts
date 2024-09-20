/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CulturaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsArray()
  @IsString({ each: true })
  readonly paisIds: string[];

  @IsArray()
  @IsString({ each: true })
  readonly productoIds: string[];

  @IsArray()
  @IsString({ each: true })
  readonly restauranteIds: string[];

  @IsArray()
  @IsString({ each: true })
  readonly recetaIds: string[];
}
