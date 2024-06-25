import { Injectable, HttpStatus } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ElasticsearchIndex } from 'src/common/enum/elasticsearch-index.enum';

@Injectable()
export class SearchService {
  private client: Client = new Client({
    node: process.env.ELASTICSEARCH_HOST,
    auth: {
      username: 'elastic',
      password: process.env.ELASTICSEARCH_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async createDocument<T>(type: ElasticsearchIndex, id: string, body: T) {
    await this.client.index({
      index: type,
      id,
      body,
    });
  }

  async deleteDocument(type: ElasticsearchIndex, id: string) {
    await this.client.delete({
      index: type,
      id,
    });
  }

  async updateDocumentt<T>(type: ElasticsearchIndex, id: string, body: T) {
    await this.client.update({
      index: type,
      id,
      body: {
        doc: body,
      },
    });
  }

  async search(type: ElasticsearchIndex, titleSearch: string) {
    try {
      let results = (
        await this.client.search({
          index: type,
          query: {
            match: {
              title: {
                query: titleSearch,
                fuzziness: 2, // Allow for up to 2 character errors
                operator: 'or',
              },
            },
          },
        })
      ).hits.hits.map((ele) => ele._source);

      return {
        type: 'Success',
        code: HttpStatus.OK,
        message: results,
      };
    } catch (err) {
      return {
        type: 'Error',
        code: HttpStatus.BAD_GATEWAY,
        message: err?.message,
      };
    }
  }
  async test() {
    const a = await this.client.search({
      index: 'products',
      query: {
        match: {
          title: {
            query: 'day',
            fuzziness: 2, // Allow for up to 2 character errors
            operator: 'or',
          },
        },
      },
    });

    return a.hits.hits;
  }
  async deleteIndex(index: string) {
    const isIndexExist = await this.client.indices.exists({ index });
    if (isIndexExist) await this.client.indices.delete({ index });
  }
}
