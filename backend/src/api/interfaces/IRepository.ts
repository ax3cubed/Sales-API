import { ObjectId } from "mongodb";
import { type DeleteResult, type FindOneOptions, UpdateResult } from "typeorm";
export interface IRepository<T> {
  find(): Promise<T[]>;
  findOne(options: FindOneOptions<T>): Promise<T | null>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: ObjectId | string): Promise<DeleteResult>;
}
