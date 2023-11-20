import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemProduct } from '../entities/sem_product.entity';
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

const axios = require('axios');

@Injectable()
export class SemProductService {
  constructor(
    @InjectRepository(SemProduct)
    private readonly semProductRepository: Repository<SemProduct>,
  ) {}

  findAll(): Promise<SemProduct[]> {
    return this.semProductRepository.find();
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
