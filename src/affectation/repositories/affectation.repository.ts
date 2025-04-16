import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Affectation } from '../entities/affectation.entity';


@Injectable()
export class AffectationRepository extends Repository<Affectation> {
  constructor(private readonly dataSource: DataSource) {
    super(Affectation, dataSource.createEntityManager());
  }
}