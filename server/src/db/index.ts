import { drizzle } from 'drizzle-orm/mysql2';
import { DBController } from "./db-controller.ts";

export class DB {
  private static instance: DB;
  private database;
  public dbController;
  private constructor() {
    this.database = drizzle(process.env.DATABASE_URL!);
    this.dbController = new DBController(this.database);
  }

  public static getInstance() {
    return this.instance || (this.instance = new this());
  }
}
