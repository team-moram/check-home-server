import { Module } from "@nestjs/common";
import {ConfigModule} from "@nestjs/config"
import { DbInfoConfig, EmailInfoConfig, SecurityConfig } from "./register.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`${__dirname}/env/.env.${process.env.NODE_ENV}`],
            load: [DbInfoConfig, EmailInfoConfig, SecurityConfig],
            isGlobal: true
        }) 
    ]
})
export class EnvConfigModule {

}