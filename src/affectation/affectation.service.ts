import { Injectable, NotFoundException } from '@nestjs/common';
import { AffectationRepository } from './repositories/affectation.repository';

@Injectable()
export class AffectationService {
    constructor(
        private readonly affectationRepository: AffectationRepository,
      ) {}
    
      // récupérer  tous les  Affectations
      async getAllAffectations(){
        return this.affectationRepository.find({
          relations: ['inventory', 'operator'],
        });
      }
    
      // récupérer  les affectations by id operator
      async getAffectationsByOperator(operatorId: string){
        const affectations = await this.affectationRepository.find({
          where: { operator: { id: operatorId } },
          relations: ['inventory', 'operator'],
        });
    
        if (!affectations.length) {
          throw new NotFoundException(`No affectations found for operator ${operatorId}`);
        }
    
        return affectations;
      }
      
      //Récupérer  les affectations by id inventaire 
      async getAffectationsByInventory(inventoryId: string) {
        const affectations = await this.affectationRepository.find({
          where: { inventory: { id: inventoryId } },
          relations: ['inventory', 'operator'],
        });
      
        if (!affectations.length) {
          throw new NotFoundException(`No affectations found for inventory ${inventoryId}`);
        }
      
        return affectations;
      }
}
