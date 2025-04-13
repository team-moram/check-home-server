import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export const userRole = {"SYSADMIN": 0, "ADMIN": 2, "USER": 4} as const;

type UserRoleKeyType = keyof typeof userRole;
type UserRoleValueType = (typeof userRole) [UserRoleKeyType];

export const userStatus = {
    "ACTIVATE": 0,
    "DEACTIVATE": 1
} as const;

type UserStatusKeyType = keyof typeof userStatus;
type UserStatusValueType = (typeof userStatus) [UserStatusKeyType];

export class UserDomain {
    id?: number;
    email?: string;
    nickname: string;
    password?: string;
    role?: UserRoleKeyType;
    status?: UserStatusKeyType;
}

export class UserRequest {
    @Transform(params => params.value.trim())
    @IsString()
    @MinLength(2, { message: '최소 2글자 이상 입력해주세요.' })
    @MaxLength(10, { message: '최대 10글자까지 입력 가능합니다.' })
    @Matches(/^[a-zA-Z0-9가-힣]+$/, {
        message: '한글, 영문, 숫자만 입력 가능해요.',
    })
    readonly nickname: string;

    @IsEmail()
    readonly email: string;

    @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, {
        message: '영문, 숫자, 특수문자를 포함해 8자 이상으로 입력해주세요.'
    })
    readonly password: string;   
}

export class LoginToken {
    atk: string;
    rtk: string;
}

export class LoginRequest {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;
}