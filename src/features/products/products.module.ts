import { Module } from '@nestjs/common';
import { ShopifyModule } from 'src/shopify/shopify.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [ShopifyModule, SearchModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
