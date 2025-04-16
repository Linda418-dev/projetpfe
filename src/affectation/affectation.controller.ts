import { Controller, Get, Param } from '@nestjs/common';
import { AffectationService } from './affectation.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Affectation  Resource')
@Controller('affectations')
export class AffectationController {

    constructor(private readonly affectationService: AffectationService) {}
    
    @Get()
    async getAllAffectations() {
      return this.affectationService.getAllAffectations();
    }
  
    @Get('operator/:id')
    async getAffectationsByOperator(@Param('id') operatorId: string) {
      return this.affectationService.getAffectationsByOperator(operatorId);
    }

    @Get('inventory/:id')
    async getAffectationsByInventory(@Param('id') inventoryId: string) {
    return this.affectationService.getAffectationsByInventory(inventoryId);
}
}
