import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CulturaEntity } from '../cultura/cultura.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PaisEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  alpha2: string;

  @ManyToMany(() => CulturaEntity, (cultura) => cultura.paises)
  @JoinTable()
  culturas: CulturaEntity[];

  @OneToMany(() => CiudadEntity, (ciudad) => ciudad.pais)
  ciudades: CiudadEntity[];
}
