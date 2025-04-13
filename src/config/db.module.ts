import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory : (configService: ConfigService) => {
                return {
                    ...configService.get('db'), 
                    "entities": [`${__dirname}/../**/*.entity{.ts,.js}`],
                    "synchronize": true
                }
            }

        })
    ]

})
export class DbModule {

}