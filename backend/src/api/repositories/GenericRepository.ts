import { 
  DeleteResult, 
  EntityManager, 
  Repository,
  FindOneOptions, 
} from "typeorm";
import { IRepository } from "../interfaces/IRepository";
import { DecoratedEntity } from "../models/decorated.entity";
import { ObjectId } from "mongodb";

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

 
  async findById(id: string | ObjectId): Promise<T | null> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    return await this.repository.findOneBy({ _id: objectId } as any); // MongoDB uses _id
  }

  
  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

 
  async update(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

 
  async delete(id: string | ObjectId): Promise<DeleteResult> {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    return await this.repository.delete(objectId);
  }
}
