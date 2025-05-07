import { AnyMySql2Connection, MySql2Database } from "drizzle-orm/mysql2";

import { drizzle } from 'drizzle-orm/mysql2';
import { eq, or, and } from 'drizzle-orm';
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

  async getLettersAllWithUserID(userId:number): Promise<Result<Array<Omit<typeof lettersTable.$inferSelect,"time_send"|"time_receive">&{time_send:number,time_receive:number}>,Error>> {
    const result = await this.db.select().from(lettersTable).where(or(eq(lettersTable.user_id_from,userId),eq(lettersTable.user_id_to,userId)));
    if (result.length === 0) {
      return ok([]);
    }
    return ok(result.map((v)=>{return {...v,time_send:v.time_send.getTime(),time_receive:v.time_receive.getTime()}}));
  }

  async getLetter(id:number) {
    const result = await this.db.select().from(lettersTable).where(eq(lettersTable.id,id));
    if (result.length === 0) {
      return ok(null);
    } else {
      return ok({...result[0],time_send:result[0].time_send.getTime(),time_receive:result[0].time_receive.getTime()});
    }
  }

  async getsentLetterIdsWithUserID(userId:number) {
    const result = await this.db.select({
      id: lettersTable.id,
    }).from(lettersTable).where(and(or(eq(lettersTable.user_id_from,userId),eq(lettersTable.user_id_to,userId)),eq(lettersTable.is_sent,true)));
    if (result.length === 0) {
      return ok([]);
    } else {
      return ok(result.map((v)=>v.id));
    }
  }

  async getunsentLetterIdsWithUserID(userId:number) {
    const result = await this.db.select({
      id: lettersTable.id,
    }).from(lettersTable).where(and(or(eq(lettersTable.user_id_from,userId),eq(lettersTable.user_id_to,userId)),eq(lettersTable.is_sent,false)));
    if (result.length === 0) {
      return ok([]);
    } else {
      return ok(result.map((v)=>v.id));
    }
  }
}
