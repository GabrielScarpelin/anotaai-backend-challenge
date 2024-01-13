import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<Product | string> {
    try {
      const product = await this.prisma.product.create({
        data: {
          id: randomUUID(),
          title: createProductDto.title,
          description: createProductDto.description,
          price: createProductDto.price,
          userId: createProductDto.userId,
          categoryId: createProductDto.categoryId,
        },
      });
      return product;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findAll(categoryId: string) {
    try {
      const productsByCategory = await this.prisma.product.findMany({
        where: { categoryId },
      });
      return productsByCategory;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      return product;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      const updated = await this.prisma.product.update({
        where: { id },
        data: {
          title: updateProductDto.title || product.title,
          description: updateProductDto.description || product.description,
          price: updateProductDto.price || product.price,
          userId: updateProductDto.userId || product.userId,
        },
      });
      return updated;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: string): Promise<{ success: boolean; erro: any }> {
    try {
      await this.prisma.product.delete({ where: { id } });
      return {
        success: true,
        erro: null,
      };
    } catch (e) {
      return {
        success: false,
        erro: e,
      };
    }
  }
}
