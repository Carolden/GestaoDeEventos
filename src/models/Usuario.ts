import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cidade } from "./Cidade";
import { Inscricao } from "./Inscricao";

@Entity('usuario')
export class Usuario extends BaseEntity {
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

  @Column()
  public cpf: string;

  @Column()
  public telefone: string;

  @Column()
  public endereco: string;

  @ManyToOne(() => Cidade, (cidade) => cidade.usuarios)
  public cidade: Cidade;

  @OneToMany(() => Inscricao, (inscricao) => inscricao.usuario)
  public inscricao: Promise<Inscricao[]>;
}
