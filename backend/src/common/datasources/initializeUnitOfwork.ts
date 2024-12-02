import { Product } from "@/api/models/product.model";
import { Sales } from "@/api/models/sales.model";
import { User } from "@/api/models/user.model";
import { UnitOfWork } from "@/api/repositories/UnitOfWork";
import { getDataSource } from "./MongoDbDataSource";
import { Order } from "@/api/models/order.model";

 

// Memoized instance of the UnitOfWork
let unitOfWorkInstance: UnitOfWork | null = null;

export const initializeUnitOfWork = async () => {
  // Return the memoized UnitOfWork instance if it already exists
  if (unitOfWorkInstance) {
    return unitOfWorkInstance;
  }

  // Otherwise, create a new instance of UnitOfWork and inject services
  const dataSource = await getDataSource();
  
  const userRepository = dataSource.getRepository(User);
  const productRepository = dataSource.getRepository(Product);
  const salesRepository = dataSource.getRepository(Sales);
  const orderRepository = dataSource.getRepository(Order);

 

  // Initialize UnitOfWork with all services
  unitOfWorkInstance = new UnitOfWork({
    orderRepository,productRepository,salesRepository,userRepository
  });

  return unitOfWorkInstance;
};
