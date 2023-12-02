import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemProduct } from '../entities/sem_product.entity';
const {
  VIEW_PRODUCT_ITEMS_PER_PAGE,
  VIEW_PRODUCT_SEARCH_TITLES_LIMIT,
} = require('../../client/src/utils/globals');
// import * as axios from 'axios';

export interface ProductStructure {
  url: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  description_long: string;
  price_01: number;
  currency_01_id: number;
  price_02: number;
  currency_02_id: number;
  category: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

const axios = require('axios');

@Injectable()
export class SemProductService {
  constructor(
    @InjectRepository(SemProduct)
    private readonly semProductRepository: Repository<SemProduct>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = VIEW_PRODUCT_ITEMS_PER_PAGE,
    search?: string,
  ): Promise<PaginatedResult<SemProduct>> {
    const query = this.semProductRepository.createQueryBuilder('product');

    if (search) {
      query.where('product.title LIKE :search', { search: `%${search}%` });
    }

    const [results, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: results,
      total,
      page,
      totalPages,
    };
  }

  async findTitlesBySearch(
    search: string,
    // limit: number = VIEW_PRODUCT_SEARCH_TITLES_LIMIT,
  ): Promise<{ id: number; title: string; url: string }[]> {
    const query = this.semProductRepository.createQueryBuilder('product');

    if (search) {
      query.where('product.title LIKE :search', { search: `%${search}%` });
    }

    const products = await query
      .select(['product.id', 'product.title', 'product.url'])
      .limit(VIEW_PRODUCT_SEARCH_TITLES_LIMIT)
      .getMany();

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      url: product.url,
    }));
  }

  async findOne(id: number): Promise<SemProduct> {
    return this.semProductRepository.findOne({
      where: { id },
    });
  }

  async findOneByUrl(url: string): Promise<SemProduct> {
    return this.semProductRepository.findOne({
      where: {
        url: url,
      },
    });
  }

  async downloadImage(url) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer', // This ensures the response is a Buffer
      });

      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error downloading the image:', error);
      return null;
    }
  }

  async createProduct(productStructure: ProductStructure): Promise<SemProduct> {
    const thumbnailImageBuffer = await this.downloadImage(
      productStructure.thumbnailUrl,
    );

    const newProduct = this.semProductRepository.create({
      url: productStructure.url,
      thumbnail: thumbnailImageBuffer,
      title: productStructure.title,
      description: productStructure.description,
      price_01: productStructure.price_01,
      currency_01_id: productStructure.currency_01_id,
      price_02: productStructure.price_02,
      currency_02_id: productStructure.currency_02_id,
    });
    await this.semProductRepository.save(newProduct);
    return newProduct;
  }

  async softDelete(id: number) {
    await this.semProductRepository.softDelete(id);
  }

  async delete(id: number) {
    await this.semProductRepository.delete(id);
  }
}
