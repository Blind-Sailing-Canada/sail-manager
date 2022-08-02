import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AdminService {
  public dataSource: DataSource;

  constructor(@InjectDataSource() dataSource: DataSource) {
    this.dataSource = dataSource;
  }
}
