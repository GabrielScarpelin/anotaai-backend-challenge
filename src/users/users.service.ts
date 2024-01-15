import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User | string> {
    try {
      const { name, email, id } = await this.prisma.user.create({
        data: {
          id: randomUUID(),
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
        },
      });
      return { id, name, email, password: null };
    } catch (e) {
      if (e.code === 'P2002') {
        throw new BadRequestException(`${e.meta.target} duplicated`);
      } else {
        throw new BadRequestException(
          `PrismaError: ${e.code} Target: ${e.meta.target}`,
        );
      }
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
      return {
        success: true,
        erro: null,
        user: {
          id: user.id,
          name: user.name,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        erro: e,
        user: null,
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      const userUpdated = await this.prisma.user.update({
        where: { id },
        data: {
          id,
          email: updateUserDto.email || user.email,
          name: updateUserDto.name || user.name,
          password: updateUserDto.password || user.password,
        },
      });
      return {
        success: true,
        erro: null,
        user: {
          id: userUpdated.name,
          email: userUpdated.email,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException({
        success: false,
        erro: e,
        user: null,
      });
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.product.deleteMany({ where: { userId: id } });
      await this.prisma.category.deleteMany({ where: { userId: id } });
      await this.prisma.user.delete({ where: { id } });
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
