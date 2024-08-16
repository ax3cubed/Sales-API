import { commonValidations } from "@/common/utils/common-validations";
import { BaseEntity, Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createAt: z.date(),
  updatedAt: z.date(),
});
export type Userinput = z.infer<typeof UserSchema>;


@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  id?: ObjectId;

  @Column()
  name?: string;

  @Column()
  email?: string;

  @Column()
  age?: number;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;

  static validate(input: Userinput) {
    return UserSchema.parse(input);
  }
}
