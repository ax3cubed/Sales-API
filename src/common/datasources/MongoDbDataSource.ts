import { DataSource } from "typeorm"
import { MONGODB_CONNECTION } from "../config/env"
import { User } from "@/api/models/user.model"

export const myDataSource = new DataSource({
    type: "mongodb",
    url: MONGODB_CONNECTION,
    database:'sales_api',
    useNewUrlParser:true,
    useUnifiedTopology:true,
    synchronize: true,
    entities:[User]
})