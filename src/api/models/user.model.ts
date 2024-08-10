import { commonValidations } from '@/common/utils/common-validations';
import { z } from 'zod';

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createAt: z.date(),
  updatedAt: z.date(),
});

//Validation for UserId
export const GetUserSchema = z.object({
    params: z.object({
        id: commonValidations.id
    })
})