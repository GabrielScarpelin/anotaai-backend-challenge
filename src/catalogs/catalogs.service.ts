import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CatalogsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCatalog(id) {
    try {
      const categories = await this.prisma.category.findMany({
        where: { userId: id },
      });
      const catalog = categories.map(async (value) => {
        const products = await this.prisma.product.findMany({
          where: { categoryId: value.id },
        });
        return {
          categoryTitle: value.title,
          categoryDescription: value.description,
          itens: products,
        };
      });
      return {
        owner: id,
        catalog,
      };
    } catch (e) {
      return {
        success: false,
        erro: e,
      };
    }
  }
}
