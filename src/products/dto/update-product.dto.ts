import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  readonly title?: string;
  readonly price?: number;
  readonly description?: string;
}
