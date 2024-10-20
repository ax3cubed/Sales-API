import { BaseEntity, Entity } from "typeorm";

@Entity()
export abstract class DecoratedEntity extends BaseEntity {}
