import { BadRequestException, Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    const userUpdate = this.prisma.user.update({
      where: { id },
      data: {
        id,
        email: updateUserDto.email || user.email,
        name: updateUserDto.name || user.name,
        password: updateUserDto.password || user.password,
      },
    });
    return userUpdate;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
