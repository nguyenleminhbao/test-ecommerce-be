import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DetailUserModule } from './detail-user/detail-user.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { ShopModule } from './shop/shop.module';
import { ZaloPayModule } from './zalopay/zalopay.module';
import { OrderModule } from './order/order.module';
import { SocketModule } from './socket/socket.module';
// import { UploadModule } from './upload/upload.module';
import { CommentModule } from './comment/comment.module';
import { NewsModule } from './news/news.module';
import { SearchModule } from './elasticsearch/elasticsearch.module';
import { LivestreamModule } from './livetream/livestream.module';

@Module({
  imports: [
    AuthModule,
    DetailUserModule,
    ProductsModule,
    CartModule,
    ShopModule,
    ZaloPayModule,
    OrderModule,
    SocketModule,
    // UploadModule,
    CommentModule,
    NewsModule,
    SearchModule,
    LivestreamModule,
  ],
})
export class FeatureModule {}
