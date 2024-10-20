import { type DeleteResult, type EntityManager, type FindOneOptions, type Repository, UpdateResult } from "typeorm";
import type { IRepository } from "../interfaces/IRepository";
import type { DecoratedEntity } from "../models/decorated.entity";

export class GenericRepository<T extends DecoratedEntity> implements IRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  public get manager(): EntityManager {
    return this.repository.manager;
  }

  async find(): Promise<T[]> {
    return await this.repository.find();
  }
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }
  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }
  async update(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }
  async delete(id: string | number): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
