import type { Order } from "@/api/models/order.model";

export const validateOrder = (order: Order | null): boolean => {
  if (!order?.id) {
    throw new Error("Order ID is required to update the user.");
  }
  if (!order) {
    throw new Error("Order not Found");
  }
  if (!order.createdAt) {
    throw new Error("Order creation timestamp is mising");
  }

  const now = Date.now();
  const createdAtTimeStamp = new Date(order.createdAt).getTime();
  const timeDifferenceInMinutes = (now - createdAtTimeStamp) / (1000 * 60);

  if (timeDifferenceInMinutes > 15) {
    throw new Error("Order cannot be updated after 15 minutes from its creation.");
  }

  return false;
};
