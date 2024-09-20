import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';

export class RecetaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsUrl()
  @IsNotEmpty()
  readonly foto: string;

  @IsString()
  @IsNotEmpty()
  readonly proceso: string;

  @IsUrl()
  @IsOptional()
  readonly video?: string;

  @IsString()
  @IsNotEmpty()
  readonly culturaId: string;
}
