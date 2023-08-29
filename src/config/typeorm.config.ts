import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "dasar_database",
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
};