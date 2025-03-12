import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';


@Injectable()
export class FileRepository extends Repository<File> {
  constructor(private readonly dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }
}