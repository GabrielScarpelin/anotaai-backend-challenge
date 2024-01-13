import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;
}
