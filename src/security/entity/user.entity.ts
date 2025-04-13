import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "User"})
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 64, unique: true})
    nickname: string;

    @Column({length: 64, unique: true})
    email: string;

    @Column({length: 512})
    password: string;

    @Column({type: "tinyint"})
    auth: number;

    @Column({type: "tinyint"})
    status: number;

    @Column({name: "google_id", length: 32, nullable: true})
    googleId: string;

    @Column({name: "kakao_id", length: 32, nullable: true})
    kakaoId: string;
    
    @CreateDateColumn({name: "created_dt", type: "timestamp"})
    createDt: Date;

    @UpdateDateColumn({name: "updated_dt", type: "timestamp"})
    updateDt: Date;

    @DeleteDateColumn({name: "deleted_dt", type: "timestamp"})
    deletedDt: Date;
}