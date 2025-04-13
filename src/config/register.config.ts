import { InternalServerErrorException } from "@nestjs/common";
import { registerAs } from "@nestjs/config";
import { register } from "module";


const supportedDbTypes = [
    'mysql'
] as const;

type SupportedDbType = typeof supportedDbTypes[number];

interface DbInfo {
    type: SupportedDbType;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    poolSize: number; 
}

interface EmailAuth {
    user: string;
    pass: string;
}

interface EmailInfo {
    service: string;
    auth: EmailAuth;
}

interface SecurityInfo {
    redirectClientUrl: string;
    jwtSecretKey: string;
}

function validateDbType(type: string): SupportedDbType {
    if (supportedDbTypes.includes(type as SupportedDbType)) {
        return type as SupportedDbType;
    }
    throw new InternalServerErrorException(`지원되지 않는 데이터베이스 타입입니다: ${type}`);
}

export const DbInfoConfig = registerAs<DbInfo> ('db', () => ({
    type: validateDbType(process.env.DB_TYPE || ''),
    host: process.env.DB_HOST || '',
    port: +(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || '',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || '',
    poolSize: +(process.env.DB_POOL_SIZE || 10)
}));

export const EmailInfoConfig = registerAs<EmailInfo> ('email', () => ({
    service: process.env.EMAIL_SERVICE || '',
    auth: {
        user: process.env.EMAIL_AUTH_USER || '',
        pass: process.env.EMAIL_AUTH_PASS || ''
    }
}));

export const SecurityConfig = registerAs<SecurityInfo> ('redirectUrl', () => ({
    redirectClientUrl: process.env.REDIRECT_CLIENT_URL || '',
    jwtSecretKey: process.env.JWT_SECRET_KEY || ''
}))