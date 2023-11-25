import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('clientes')
export class Evento extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public descricao: string;

    @Column()
    public dataInicio: string;

    @Column()
    public dataFim: string;

    @Column()
    public horaInicio: string;

    @Column()
    public horaFim: string;

    @Column()
    public local: string;

    @Column()
    public id_cidade: number;

    @Column()
    public id_admin: number;

}