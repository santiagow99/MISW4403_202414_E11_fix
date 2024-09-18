import { CulturaEntity } from '../cultura/cultura.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  foto: string;

  @Column()
  proceso: string;

  @Column()
  video: string;

  @ManyToOne(() => CulturaEntity, (cultura) => cultura.recetas)
  cultura: CulturaEntity;
}
