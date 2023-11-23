import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('admin')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nome: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  public senha: string;

  @Column()
  public role: string;
}
