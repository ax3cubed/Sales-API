import { IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export abstract class DecoratedEntity extends BaseEntity {
  @ObjectIdColumn()
  _id!: ObjectId;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
   createdAt?: Date;
  
  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
   updateAt?: Date;

  @Column({ default: false, type: "boolean" })
  @IsOptional()
  softDeleted?: boolean;
}
