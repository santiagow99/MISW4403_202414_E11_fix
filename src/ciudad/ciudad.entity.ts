import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CiudadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @OneToMany(() => RestauranteEntity, (restaurante) => restaurante.restaurante)
  restaurantes: RestauranteEntity[];

  @ManyToOne(() => PaisEntity, (pais) => pais.ciudades)
  pais: PaisEntity;
}
