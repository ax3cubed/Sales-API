import { faker } from "@faker-js/faker";
import { User } from "../models/user.model";
import { Sales } from "../models/sales.model";
import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { UserService } from "../services/user.service";
import { getDataSource } from "@/common/datasources/MongoDbDataSource";
import { SalesService } from "../services/sales.service";
import { OrderService } from "../services/order.service";
import { ProductService } from "../services/product.service";
import { Seeder } from "./Seeder";

const generateUser = (): User => {
  var user: User = new User();
  user.email = faker.internet.email();
  user.name = faker.person.fullName();
  user.age = faker.number.int({ min: 18, max: 80 });

  return user;
};

const generateSales = (): Sales => {
  const sales = new Sales();
  sales.quantitySold = faker.number.int({ min: 1, max: 100 });
  sales.totalPrice = parseFloat(
    faker.finance.amount({ min: 10, max: 10000, dec: 2 })
  );
  return sales;
};

const generateProduct = (): Product => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = parseFloat(
    faker.commerce.price({ min: 1, max: 1000, dec: 2 })
  );
  product.stockQuantity = faker.number.int({ min: 1, max: 100 });
 
  product.createdAt = faker.date.past();
  product.updateAt = new Date(); // Current date as the latest update

  return product;
};

const generateOrder = (user?: User, product?: Product): Order => {
    const order = new Order();
    order.orderNumber = faker.string.alphanumeric(10).toUpperCase();
    order.product_id = product?._id?.toString() // Products are passed in
    order.quantity =  faker.number.int({min:1, max:10});
    order.user_id = user?._id?.toString(); // Assign the user to the order
    order.totalPrice = product?.price;
    order.createdAt = faker.date.past();
    order.updateAt = new Date(); // Current date as the latest update
    order.softDeleted = faker.datatype.boolean();
    return order;
  };
  const init = async () => {
    return await getDataSource();
  };
   async function runSeeder() {
    try {
      init().then((MongoDbDataSource) => {
          console.log("connection init ");
            const userService = new UserService(MongoDbDataSource.getMongoRepository(User));
            const salesService = new SalesService(MongoDbDataSource.getMongoRepository(Sales));
            const orderService = new OrderService(MongoDbDataSource.getMongoRepository(Order));
            const productService = new ProductService(
              MongoDbDataSource.getMongoRepository(Product)
            );
            console.log("database init complete");
            const createUserInService = (user: User): void => {
              userService.createUser(user);
            };
          
            const createSalesInService = (sales: Sales): void => {
              salesService.createSales(sales);
            };
          
            const createOrderInService = (order: Order): void => {
              orderService.createOrder(order);
            };
          
            const createProductInService = (product: Product): void => {
              productService.createProduct(product);
            };
           console.log("before seed after service initialization");
           
            const productSeeder = new Seeder<Product>(generateProduct, createProductInService);
            productSeeder.seed(50); 
          
            const userSeeder = new Seeder<User>(generateUser, createUserInService);
            userSeeder.seed(20);
          
          
            
            const salesSeeder = new Seeder<Sales>(generateSales, createSalesInService);
            salesSeeder.seed(10);
          
          
            userService.getAllUsers().then((users: User[]) => {
              const user = users[0];
              productService.find().then((products) => {
                const orders = products.map((product) =>
                  generateOrder(user, product)
                );
                orders.forEach((order) => createOrderInService(order));
              });
            });
           
          
          
            
          });
    } catch (error) {
        console.log(error)
    }

  }
  runSeeder();
