import { UpdateResult, DeleteResult, Repository, FindOneOptions, EntityManager } from "typeorm";
import { IRepository } from "./IRepository";
import { MongoDbDataSource } from "@/common/datasources";
import { DecoratedEntity } from "../models/decorated.entity";


export class GenericRepository<T extends DecoratedEntity> implements IRepository<T>{
    // private repository: Repository<T>;

    // /**
    //  *
    //  */
    // constructor(entity: any) {
    //    this.repository = MongoDbDataSource.getRepository(entity);
    // }

    /**
     *
     */
    constructor(protected readonly repository: Repository<T>) {}

    
    public get manager() : EntityManager {
        return this.repository.manager;
    }
    
    async find(): Promise<T[]> {
        return await  this.repository.find();
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