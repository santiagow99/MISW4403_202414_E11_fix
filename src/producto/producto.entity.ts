import { CategoriaEntity } from '../categoria/categoria.entity';
import { CulturaEntity } from '../cultura/cultura.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  historia: string;

  @ManyToMany(() => CulturaEntity, (cultura) => cultura.productos)
  culturas: CulturaEntity[];

  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.productos)
  categoria: CategoriaEntity;
}
