import type { Order } from "@/api/models/order.model";

export const validateOrder = (order: Order | null): boolean => {
 
  if (!order) {
    return false;
  }
  if (!order.createdAt) {
    return false;
  }
 
  return true;
};
