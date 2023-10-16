import { TypeOrmModuleOptions } from "@nestjs/typeorm";
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "belajar_projek_xi",
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
  logging: true,
};