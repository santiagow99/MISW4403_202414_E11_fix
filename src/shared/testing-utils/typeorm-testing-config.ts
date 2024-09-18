import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from '../../categoria/categoria.entity';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { CulturaEntity } from '../../cultura/cultura.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CategoriaEntity,
      CiudadEntity,
      CulturaEntity,
      PaisEntity,
      ProductoEntity,
      RecetaEntity,
      RestauranteEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CategoriaEntity,
    CiudadEntity,
    CulturaEntity,
    PaisEntity,
    ProductoEntity,
    RecetaEntity,
    RestauranteEntity,
  ]),
];
