import { UserEntity } from "src/security/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({name: 'ResetPasswordEmail'})
export class ResetPasswordEmailEntity {
   
    @ManyToOne(()=> UserEntity, (user) => user.email)
    @JoinColumn({name: 'email', referencedColumnName: 'email'})
    email: string;

    @Column({name: 'uuid', length: 128})
    @PrimaryColumn()
    uuid: string;

    @Column({name: 'expire_dt', type: 'timestamp'})
    expiredDt: Date;

    @CreateDateColumn()
    createDt: Date;
}