import { ProductoEntity } from '../producto/producto.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RecetaEntity } from '../receta/receta.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Entity()
export class CulturaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => RecetaEntity, (receta) => receta.cultura)
  recetas: RecetaEntity[];

  @ManyToMany(() => PaisEntity, (pais) => pais.culturas)
  @JoinTable()
  paises: PaisEntity[];

  @ManyToMany(() => ProductoEntity, (producto) => producto.culturas)
  @JoinTable()
  productos: ProductoEntity[];

  @ManyToMany(() => RestauranteEntity, (restaurante) => restaurante.culturas)
  @JoinTable()
  restaurantes: RestauranteEntity[];
}
