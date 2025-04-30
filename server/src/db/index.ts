import { AnyMySql2Connection, MySql2Database } from "drizzle-orm/mysql2";

import { drizzle } from 'drizzle-orm/mysql2';
import { eq, or } from 'drizzle-orm';
import { ok, err, Result } from 'neverthrow';
import { lettersTable, usersTable } from './schema.ts';

export class DBController {
  db: MySql2Database<Record<string, never>> & {
    $client: AnyMySql2Connection;
  }

  constructor(db: MySql2Database<Record<string, never>> & {
    $client: AnyMySql2Connection;
  }) {
    this.db = db;
  }

  async addUser(email:string,name:string, passwordHash:string) : Promise<Result<number, Error>> {
    const result = await this.db.select().from(usersTable).where(eq(usersTable.email,email));
    if (result.length !== 0) {
      return err(new Error("Already Registered with this email"));
    }
    try {
      const id = (await this.db.insert(usersTable).values({
          email,
          name,
          passwordHash,
      }).$returningId())[0].id;
      return ok(id);
    } catch(e) {
      console.log(e)
      return err(new Error("DB Insert Error in addUser"));
    }
  }

  async getUser(email:string) : Promise<Result<{
    id: number;
    name: string;
    email: string;
    passwordHash: string;
  }, Error>> {
    const result = await this.db.select().from(usersTable).where(eq(usersTable.email,email));
    if (result.length === 0) {
      return err(new Error("Not Registered with this email"));
    }
    return ok(result[0]);
  }

  async addLetter(prop: typeof lettersTable.$inferInsert) {
    try {
      const id = (await this.db.insert(lettersTable).values(prop).$returningId())[0].id;
      return ok(id);
    } catch(e) {
      console.log(e)
      return err(new Error("DB Insert Error in addLetter"));
    }
  }

  async getLetterWithUserID(id:number): Promise<Result<Array<typeof lettersTable.$inferSelect>,Error>> {
    const result = await this.db.select().from(lettersTable).where(or(eq(lettersTable.user_id_from,id),eq(lettersTable.user_id_to,id)));
    if (result.length === 0) {
      return ok([]);
    }
    return ok(result);
  }
}
