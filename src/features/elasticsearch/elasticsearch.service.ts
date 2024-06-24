import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class SearchService {
  private client: Client = new Client({
    node: 'https://localhost:9200',
    auth: {
      username: 'elastic',
      password: '0NLY2HelMdO92QRmiJod',
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async test() {
    const a = await this.client.indices.exists({ index: 'test' });

    return a;
  }
}
