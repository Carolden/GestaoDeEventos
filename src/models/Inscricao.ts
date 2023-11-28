import { BaseEntity, 
    Column, 
    Entity, 
    JoinColumn, 
    OneToMany,
    OneToOne,
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { Evento } from "./Evento";
import { Usuario } from "./Usuario";

@Entity("Inscrição")
export class Inscricao extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public id_evento: number;
    
    @Column()
    public id_usuario: number;
    
    @Column()
    public status: string;

    @OneToMany(() => Evento, (evento) => evento.inscricao, { eager: true })
    @JoinColumn({ name: "id_evento" })
    public evento: Evento;

    @OneToOne(() => Usuario, (usuario) => usuario.inscricao, { eager: true })
  @JoinColumn({ name: "id_usuario" })
  public usuario: Usuario;
}