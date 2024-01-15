import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createProductDto: CreateProductDto,
  ): Promise<{ success: boolean; erro: any; product: Product | null }> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id: createProductDto.categoryId },
      });
      if (createProductDto.userId === category.userId) {
        const product = await this.prisma.product.create({
          data: {
            id: randomUUID(),
            title: createProductDto.title,
            description: createProductDto.description,
            price: createProductDto.price,
            userId: category.userId,
            categoryId: createProductDto.categoryId,
          },
        });
        return {
          success: true,
          erro: null,
          product,
        };
      } else {
        throw new NotFoundException(
          'Tried insert a product to a different user that the owner of the category',
        );
      }
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        erro: e,
        product: null,
      });
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

  async findOne(
    id: string,
  ): Promise<{ success: boolean; erro: any; product: Product }> {
    try {
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id },
      });
      return {
        success: true,
        erro: null,
        product,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        erro: e,
        product: null,
      });
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{ success: boolean; erro: any; product: Product }> {
    try {
      const product = await this.prisma.product.findUniqueOrThrow({
        where: { id },
      });
      const updated = await this.prisma.product.update({
        where: { id },
        data: {
          title: updateProductDto.title || product.title,
          description: updateProductDto.description || product.description,
          price: updateProductDto.price || product.price,
        },
      });
      return {
        success: true,
        erro: null,
        product: updated,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        erro: e,
        product: null,
      });
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
      throw new InternalServerErrorException({
        success: false,
        erro: e,
      });
    }
  }
}
