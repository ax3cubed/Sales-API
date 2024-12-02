import type { Order } from "@/api/models/order.model";

export const validateOrder = (order: Order | null): boolean => {
 
  if (!order) {
    return false;
  }
  if (!order.createdAt) {
    return false;
  }

  const now = Date.now();
  const createdAtTimeStamp = new Date(order.createdAt).getTime();
  const timeDifferenceInMinutes = (now - createdAtTimeStamp) / (1000 * 60);

  // if (timeDifferenceInMinutes > 15) {
  //   throw new Error("Order cannot be updated after 15 minutes from its creation.");
  // }

  return true;
};
