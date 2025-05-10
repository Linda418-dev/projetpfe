import { Injectable, NotFoundException } from '@nestjs/common';
import { AnomalyStatusRepository } from './repositories/anomaly-status.repository';

@Injectable()
export class AnomalyStatusService {
    constructor(
        private readonly anomalyStatusRepository: AnomalyStatusRepository,
      ) {}
    
      // Obtenir tout l'historique des anomalies
      async getAllHistory() {
        return this.anomalyStatusRepository.find({
          relations: ['anomaly', 'status'],
          order: { createdAt: 'DESC' },
        });
      }
    
      // Obtenir l'historique d'une anomalie spécifique
      async getHistoryByAnomalyId(anomalyId: string) {
        const history = await this.anomalyStatusRepository.find({
          where: { anomaly: { id: anomalyId } },
          relations: ['status'],
          order: { createdAt: 'ASC' },
        });
    
        if (!history || history.length === 0) {
          throw new NotFoundException(`No status history found for anomaly ${anomalyId}`);
        }
    
        return history;
      }
}
