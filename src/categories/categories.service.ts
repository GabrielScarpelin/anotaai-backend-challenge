import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { randomUUID } from 'node:crypto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ success: boolean; erro: any; category: Category | null }> {
    try {
      const category = await this.prisma.category.create({
        data: {
          id: randomUUID(),
          title: createCategoryDto.title,
          description: createCategoryDto.description,
          userId: createCategoryDto.userId,
        },
      });
      return {
        success: true,
        erro: null,
        category,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        erro: e,
        category: null,
      });
    }
  }

  async findOne(
    id: string,
  ): Promise<{ success: boolean; erro: any; category: Category | null }> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
      });
      return {
        success: true,
        erro: null,
        category,
      };
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        erro: e,
        category: null,
      });
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ success: boolean; erro: any; category: Category | null }> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
      });
      const categoryUpdated = await this.prisma.category.update({
        where: {
          id,
        },
        data: {
          id,
          description: updateCategoryDto.description || category.description,
          title: updateCategoryDto.title || category.title,
          userId: updateCategoryDto.userId || category.userId,
        },
      });
      return {
        success: true,
        erro: null,
        category: categoryUpdated,
      };
    } catch (e) {
      return {
        success: false,
        erro: e,
        category: null,
      };
    }
  }

  async remove(id: string): Promise<{ success: boolean; erro: any }> {
    try {
      await this.prisma.product.deleteMany({ where: { categoryId: id } });
      await this.prisma.category.delete({ where: { id } });
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
