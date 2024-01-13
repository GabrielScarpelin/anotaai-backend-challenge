import { Controller, Get } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  searchClientCatalog() {
    return 'Find catalog on S3 BUCKET';
  }
}
