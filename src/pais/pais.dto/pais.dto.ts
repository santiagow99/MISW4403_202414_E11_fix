/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class PaisDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly alpha2: string;

  @IsArray()
  @IsString({ each: true })
  readonly culturaIds: string[];

  @IsArray()
  @IsString({ each: true })
  readonly ciudadIds: string[];
}
