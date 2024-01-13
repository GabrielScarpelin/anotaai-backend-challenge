import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  readonly title?: string;
  readonly price?: number;
  readonly categoryId?: string;
  readonly description?: string;
  readonly userId?: string;
}
