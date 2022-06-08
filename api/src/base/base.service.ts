import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

export class BaseService<T> extends TypeOrmCrudService<T> {
  get repository(){
    return this.repo;
  }
}
