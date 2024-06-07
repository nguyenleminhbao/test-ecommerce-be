import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuaration';
import { FeatureModule } from './features/feature.module';
import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ShopifyModule } from './shopify/shopify.module';

@Module({
  imports: [
    FeatureModule,
    PrismaModule,
    RedisModule,
    ShopifyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `${process.cwd()}/src/config/env/.env.${process.env.NODE_ENV}`,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
