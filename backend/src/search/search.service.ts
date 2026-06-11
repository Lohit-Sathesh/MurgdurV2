import { Injectable } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
@Injectable()
export class SearchService{private client=new MeiliSearch({host:process.env.MEILISEARCH_HOST||'http://localhost:7700',apiKey:process.env.MEILISEARCH_KEY}); syncProduct(product:unknown){return this.client.index('products').addDocuments([product as Record<string,unknown>])} deleteProduct(id:string){return this.client.index('products').deleteDocument(id)} reindexAll(products:unknown[]){return this.client.index('products').addDocuments(products as Record<string,unknown>[])}}
