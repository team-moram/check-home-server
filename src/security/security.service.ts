import { Inject, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { LoginToken, UserDomain, userRole, userStatus } from './dto/user.dto';
import { getSha512Hash } from 'src/crpto/crpto.util';
import { ResetPasswordEmailEntity } from 'src/email/entity/email.entity';
import { SecurityConfig } from 'src/config/register.config';
import { ConfigType } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SecurityService {

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(ResetPasswordEmailEntity) private readonly resetUserPasswordEmail: Repository<ResetPasswordEmailEntity>,
        @Inject(SecurityConfig.KEY) private readonly config: ConfigType<typeof SecurityConfig>,
        private readonly emailService: EmailService){}
    

    async createUserByEmail(user: UserDomain): Promise<UserEntity> {

        if ((user.email && await this.findUserByEmail(user.email)) || await this.findUserByNickname(user.nickname)) {
            throw new UnprocessableEntityException("이미 존재하는 회원정보가 있습니다.")
        }

        return await this.saveUser(user)
    }

    async saveUser(user: UserDomain) {
        
        const userEntity = new UserEntity();

        userEntity.nickname = user.nickname;
        userEntity.email = user.email || '';
        userEntity.password = getSha512Hash(user.password);
        userEntity.auth = userRole["USER"];
        userEntity.status = userStatus["ACTIVATE"];

        return await this.userRepository.save(userEntity);
    }

    async findUserByEmail(email: string): Promise<UserEntity | null>{
        return await this.userRepository.findOne({
            where: {email}
        })
    }

    async findUserByNickname(nickname: string): Promise<UserEntity | null>{
        return await this.userRepository.findOne({
            where: {nickname}
        })
    }

    async sendPasswordResetEmail(email: string) {
        const existEmail = this.findUserByEmail(email)

        if (!existEmail)
            throw new NotFoundException('존재하지 않는 이메일입니다.');

        const entity = await this.createUniqueIdForResetPassword(email);

        const html = `
        <div>비밀번호를 변경하시려면 아래 버튼을 눌러주세요.</div>
        <form action="${this.config.redirectClientUrl}/reset-password?uuid=${entity.uuid}" method="POST">
            <button style="display: flex;
                            height: 50px;
                            padding: 0px var(--padding-8, 24px);
                            justify-content: center;
                            align-items: center;
                            gap: var(--gap-3, 8px);
                            align-self: stretch;
                            border-radius: var(--radius-4, 8px);
                            background: var(--color-button-primary-fill, #FC5E03);
                            color: white;
                            border: none;
                            ">
                            비밀번호 변경
                            </button>
        </form>`


        this.emailService.sendEmail({
            to: email,
            subject: '[우리방] 비밀번호 변경 안내 메일입니다.',
            html
        }); 
    }

    async createUniqueIdForResetPassword(email: string) :Promise<ResetPasswordEmailEntity>{
        const entity = new ResetPasswordEmailEntity();

        entity.email = email;
        entity.uuid = uuid.v1();
        entity.expiredDt = new Date(Date.now() + 3 * 60 * 1000);
    
        return await this.resetUserPasswordEmail.save(entity);
    }


    async login(email: string, password: string): Promise<LoginToken> {
        const existEmail= await this.userRepository.findOne({
            select: {email: true},
            where: {email}
        });

        if (!existEmail)
            throw new UnauthorizedException('아이디나 비밀번호가 일치하지 않습니다.');

        const loginUser = await this.userRepository.findOne({
            select: {id: true},
            where: {email, password: getSha512Hash(password)}
        });

        if (!loginUser)
            throw new UnauthorizedException('아이디나 비밀번호가 일치하지 않습니다.');

        const payload = {id: loginUser.id};

        const atk = this.createJwt(payload, '30m');

        //TODO user id, rtk, expired dt -> DB insert
        const rtk = this.createJwt(payload, '7d');

        return {
            atk,
            rtk
        }
        
    }

    createJwt(payload: any, expiresIn): string {
        return jwt.sign(payload, this.config.jwtSecretKey, {
            algorithm: "HS512",
            expiresIn,
            audience: "todo.net",
            issuer: "todo.net" 
        }) 
    }

}
