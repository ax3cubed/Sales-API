import { DeleteResult, FindOneOptions, UpdateResult } from "typeorm";
export interface IRepository<T>{
    find(): Promise<T[]>;
    findOne(options: FindOneOptions<T>): Promise<T | null>;
    save(entity: T): Promise<T>;
    update(entity: T): Promise<T>
    delete(id: string | number):Promise<DeleteResult>
}