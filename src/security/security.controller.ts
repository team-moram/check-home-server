import { Body, Controller, Get, HttpCode, Param, Post, ValidationPipe } from '@nestjs/common';
import { LoginRequest, LoginToken, UserRequest } from './dto/user.dto';
import { SecurityService } from './security.service';

@Controller('/api/security')
export class SecurityController {

    constructor(private readonly securityService: SecurityService){}
    
    @Post('/create/user')
    async createUser(@Body(ValidationPipe) dto: UserRequest): Promise<void> {
       const {nickname, email, password} = dto;
       
       await this.securityService.createUserByEmail({
           nickname,
           email,
           password
       })
    }

    @Get('/check-duplicate/email/:email')
    async checkDuplicateEmail(@Param('email') email: string): Promise<boolean> {
        const user = await this.securityService.findUserByEmail(email);
        return !!user;
    }

    @Get('/check-duplicate/nickname/:nickname') 
    async checkDuplicateNickname(@Param('nickname') nickname: string): Promise<boolean> {
        const user = await this.securityService.findUserByNickname(nickname);
        return !!user;
    }

    @HttpCode(200)
    @Post('/reset-password/email')
    async sendPasswordResetEmail(@Body('email') email: string): Promise<void> {
        await this.securityService.sendPasswordResetEmail(email);
    }

    @HttpCode(200)
    @Post('/login')
    async login(@Body(ValidationPipe) dto: LoginRequest): Promise<LoginToken> {
        return await this.securityService.login(dto.email, dto.password);
    }
    
}
