import { User } from "@/api/models/user.model";
import { DataSource } from "typeorm";
import { MONGODB_CONNECTION } from "../config/env";
import { logger } from "../config/logger/logger.config";

 const myDataSource = new DataSource({
  type: "mongodb",
  url: MONGODB_CONNECTION,
  database: "sales_api",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  entities: [User],
});

myDataSource.initialize()
  .then(async () => {
    logger.info("Connection initialized with database...");
  })
  .catch((error) => logger.error(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (myDataSource.isInitialized) return Promise.resolve(myDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (myDataSource.isInitialized) resolve(myDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};