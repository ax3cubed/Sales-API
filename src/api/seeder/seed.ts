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

const generateProduct = (order?: Order): Product => {
  const product = new Product();
  product.name = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = parseFloat(
    faker.commerce.price({ min: 1, max: 1000, dec: 2 })
  );
  product.stockQuantity = faker.number.int({ min: 1, max: 100 });
  product.order = order;
  product.createdAt = faker.date.past();
  product.updateAt = new Date(); // Current date as the latest update

  return product;
};

const generateOrder = (user?: User, products?: Product[]): Order => {
    const order = new Order();
    order.orderNumber = faker.string.alphanumeric(10).toUpperCase();
    order.products = products || [];  // Products are passed in
    order.quantity = order.products.reduce((acc, product) => acc + (product.stockQuantity ?? 0), 0);
    order.user = user; // Assign the user to the order
    order.totalPrice = order.products.reduce((acc, product) => acc + (product.price ?? 0), 0);
    order.createdAt = faker.date.past();
    order.updateAt = new Date(); // Current date as the latest update
    order.softDeleted = faker.datatype.boolean();
    return order;
  };
  export async function runSeeder() {
    try {
        getDataSource().then((MongoDbDataSource) => {
            const userService = new UserService(MongoDbDataSource.getRepository(User));
            const salesService = new SalesService(MongoDbDataSource.getRepository(Sales));
            const orderService = new OrderService(MongoDbDataSource.getRepository(Order));
            const productService = new ProductService(
              MongoDbDataSource.getRepository(Product)
            );
          
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
          
            const productSeeder = new Seeder<Product>(generateProduct, createProductInService);
            productSeeder.seed(500); 
          
            const userSeeder = new Seeder<User>(generateUser, createUserInService);
            userSeeder.seed(100);
          
          
            
            const salesSeeder = new Seeder<Sales>(generateSales, createSalesInService);
            salesSeeder.seed(100);
          
          
            userService.getAllUsers().then((users: User[]) => {
              const user = users[0];
              productService.find().then((products) => {
                const orders = products.map((product) =>
                  generateOrder(user, [product])
                );
                orders.forEach((order) => createOrderInService(order));
              });
            });
           
          
          
            
          });
    } catch (error) {
        console.log(error)
    }

  }
