import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Evento } from "./Evento";

@Entity("admin")
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nome: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  public senha: string;

  @Column({ nullable: true })
  public role: string;

  @OneToMany(() => Evento, (evento) => evento.admin)
  public evento: Promise<Evento[]>;
}
