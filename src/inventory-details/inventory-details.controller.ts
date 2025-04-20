import { Controller } from '@nestjs/common';
import { InventoryDetailsService } from './inventory-details.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('inventory-details Resource')
@Controller('inventory-details')
export class InventoryDetailsController {
    constructor(private readonly inventoryDetailsService: InventoryDetailsService) {}
  
}
