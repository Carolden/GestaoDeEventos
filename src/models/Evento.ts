import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cidade } from "./Cidade";
import { Admin } from "./Admin";

@Entity("eventos")
export class Evento extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public titulo: string;

  @Column()
  public descricao: string;

  @Column({
    type: "date",
  })
  public dataInicio: string;

  @Column({
    type: "date",
  })
  public dataFim: string;

  @Column({
    type: "time",
  })
  public horaInicio: string;

  @Column({
    type: "time",
  })
  public horaFim: string;

  @Column()
  public local: string;

  @Column()
  public id_cidade: number;

  @Column()
  public id_admin: number;

  @ManyToOne(() => Cidade, (cidade) => cidade.evento, { eager: true })
  @JoinColumn({ name: "id_cidade" })
  public cidade: Cidade;

  @ManyToOne(() => Admin, (admin) => admin.evento, { eager: true })
  @JoinColumn({ name: "id_admin" })
  public admin: Admin;
}
