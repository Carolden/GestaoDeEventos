import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Evento } from "./Evento";

@Entity("cidades")
export class Cidade extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nome: string;

  @OneToMany(() => Evento, (evento) => evento.cidade)
  public evento: Promise<Evento[]>;
}
