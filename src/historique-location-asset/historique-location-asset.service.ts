import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriqueLocationAsset } from './entities/historique-location-asset.entity';

@Injectable()
export class HistoriqueLocationAssetService {
  constructor(
    @InjectRepository(HistoriqueLocationAsset)
    private historiqueLocationAssetRepository: Repository<HistoriqueLocationAsset>,
  ) {}

  async createHistorique(assetId: string, assetName: string, placeId: string, placeName: string) {
    const historique = new HistoriqueLocationAsset();
    historique.assetId = assetId;
    historique.assetName = assetName;
    historique.locationId = placeId;
    historique.locationName = placeName;
    historique.createdAt = new Date(); 
    
    return await this.historiqueLocationAssetRepository.save(historique);
  }
  async getAllHistory() {
    const historiques = await this.historiqueLocationAssetRepository.find();  
    console.log(' historique :', historiques);
    return historiques;
  }
  
  async getHistoriqueByAssetId(assetId: string): Promise<HistoriqueLocationAsset[]> {
    return await this.historiqueLocationAssetRepository.find({
      where: { assetId },
      relations: ['asset', 'place'], 
      order: { createdAt: 'DESC' },  
    });
  }
}
