import { Injectable } from '@nestjs/common';
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
  ): Promise<Category | string> {
    try {
      const category = await this.prisma.category.create({
        data: {
          id: randomUUID(),
          title: createCategoryDto.title,
          description: createCategoryDto.description,
          userId: createCategoryDto.userId,
        },
      });
      return category;
    } catch (e) {
      return e;
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
      });
      return category;
    } catch (e) {
      return {
        success: false,
        erro: `${e.code} - No match found`,
      };
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: { id },
      });
      const categoryUpdated = await this.prisma.category.update({
        where: {
          id,
        },
        data: {
          description: updateCategoryDto.description || category.description,
          title: updateCategoryDto.title || category.title,
          userId: updateCategoryDto.userId || category.userId,
        },
      });
      return categoryUpdated;
    } catch (e) {
      return {
        success: false,
        erro: e,
      };
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.deleteMany({ where: { categoryId: id } });
      await this.prisma.category.delete({ where: { id } });
      return {
        success: false,
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
