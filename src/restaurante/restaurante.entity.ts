import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CulturaEntity } from '../cultura/cultura.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RestauranteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  estrellasMichelin: string;

  @Column({ type: 'date', nullable: true })
  fechaConsecuencion: Date;

  @ManyToMany(() => CulturaEntity, (cultura) => cultura.restaurantes)
  culturas: CulturaEntity[];

  @ManyToOne(() => CiudadEntity, (ciudad) => ciudad.restaurantes)
  ciudad: CiudadEntity;
}
