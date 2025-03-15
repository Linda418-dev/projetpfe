import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { File } from '../entities/file.entity';
@Injectable()
export class FileRepository extends Repository<File> {
  constructor(private readonly dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }
}