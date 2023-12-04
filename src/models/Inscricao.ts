import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Evento } from "./Evento";
import { Usuario } from "./Usuario";

@Entity("inscricao")
export class Inscricao extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public id_evento: number;

  @Column()
  public id_usuario: number;

  @Column()
  public status: string;

  @ManyToOne(() => Evento, (evento) => evento.inscricao, { eager: true })
  @JoinColumn({ name: "id_evento" })
  public evento: Evento;

  @ManyToOne(() => Usuario, (usuario) => usuario.inscricao, { eager: true })
  @JoinColumn({ name: "id_usuario" })
  public usuario: Usuario;
}
