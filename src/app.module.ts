import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecetaEntity } from './receta/receta.entity';
import { RecetaModule } from './receta/receta.module';
import { CategoriaEntity } from './categoria/categoria.entity';
import { CategoriaModule } from './categoria/categoria.module';
import { CiudadEntity } from './ciudad/ciudad.entity';
import { CiudadModule } from './ciudad/ciudad.module';
import { PaisEntity } from './pais/pais.entity';
import { PaisModule } from './pais/pais.module';
import { ProductoEntity } from './producto/producto.entity';
import { ProductoModule } from './producto/producto.module';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { RestauranteModule } from './restaurante/restaurante.module';
import { CulturaEntity } from './cultura/cultura.entity';
import { CulturaModule } from './cultura/cultura.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaRecetaModule } from './cultura-receta/cultura-receta.module';
import { CulturaPaisModule } from './cultura-pais/cultura-pais.module';
import { CulturaProductoModule } from './cultura-producto/cultura-producto.module';
import { CulturaRestauranteModule } from './cultura-restaurante/cultura-restaurante.module';
import { CategoriaProductoModule } from './categoria-producto/categoria-producto.module';
import { CiudadRestauranteModule } from './ciudad-restaurante/ciudad-restaurante.module';
import { PaisCiudadModule } from './pais-ciudad/pais-ciudad.module';

@Module({
  imports: [
    RecetaModule,
    CategoriaModule,
    CiudadModule,
    PaisModule,
    ProductoModule,
    RestauranteModule,
    CulturaModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [
        RecetaEntity,
        CategoriaEntity,
        CiudadEntity,
        PaisEntity,
        ProductoEntity,
        RestauranteEntity,
        CulturaEntity,
      ],
      synchronize: true,
    }),
    CulturaRecetaModule,
    CulturaPaisModule,
    CulturaProductoModule,
    CulturaRestauranteModule,
    CategoriaProductoModule,
    CiudadRestauranteModule,
    PaisCiudadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
