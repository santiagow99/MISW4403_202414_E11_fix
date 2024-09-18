import { ProductoEntity } from '../producto/producto.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CategoriaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @OneToMany(() => ProductoEntity, (producto) => producto.categoria)
  productos: ProductoEntity[];
}
