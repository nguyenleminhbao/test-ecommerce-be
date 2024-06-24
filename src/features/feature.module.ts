import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DetailUserModule } from './detail-user/detail-user.module';
import { ProductsModule } from './products/products.module';
import { CheckoutModule } from './checkout/checkout.module';
import { CartModule } from './cart/cart.module';
import { ShopModule } from './shop/shop.module';
import { ZaloPayModule } from './zalopay/zalopay.module';
import { OrderModule } from './order/order.module';
import { SocketModule } from './socket/socket.module';
import { CustomerModule } from './customer/customer.module';
import { UploadModule } from './upload/upload.module';
import { LivestreamModule } from './livetream/livestream.module';
import { CommentModule } from './comment/comment.module';
import { NewsModule } from './news/news.module';
import { SearchModule } from './elasticsearch/elasticsearch.module';

@Module({
  imports: [
    AuthModule,
    DetailUserModule,
    ProductsModule,
    CheckoutModule,
    CartModule,
    ShopModule,
    ZaloPayModule,
    OrderModule,
    SocketModule,
    CustomerModule,
    UploadModule,
    LivestreamModule,
    CommentModule,
    NewsModule,
    SearchModule,
  ],
})
export class FeatureModule {}
