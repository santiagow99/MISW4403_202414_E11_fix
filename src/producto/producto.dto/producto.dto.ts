/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  @IsNotEmpty()
  readonly historia: string;

  @IsArray()
  @IsString({ each: true })
  readonly culturaIds: string[];

  @IsString()
  @IsNotEmpty()
  readonly categoriaId: string;
}
