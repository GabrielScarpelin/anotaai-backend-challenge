import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsUUID()
  readonly categoryId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;
}
