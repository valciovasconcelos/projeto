import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/Users";
import { Situation } from "./entity/Situations";
import { Product } from "./entity/Products";
import { ProductCategory } from "./entity/ProductCategories";
import { ProductSituation } from "./entity/ProductSituations";
import dotenv from "dotenv";
dotenv.config();

const dialect = process.env.DB_DIALECT ?? "mysql"

export const AppDataSource = new DataSource({
    type: dialect as "mysql" | "mariadb" | "postgres" | "mongodb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [User, Situation, Product, ProductCategory, ProductSituation],
    subscribers: [],
    migrations: ["dist/migration/*.js"],
})