import { AnyMySql2Connection, MySql2Database } from "drizzle-orm/mysql2";
import { lettersTable, lettersViewsTable, usersTable } from "./schema.ts";
import { err, ok, Result } from "neverthrow";
import { eq,or,and,lt, sql } from "drizzle-orm";

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

  async getUserWithID(id:number) : Promise<Result<{
    id: number;
    name: string;
    email: string;
    passwordHash: string;
  }, Error>> {
    const result = await this.db.select().from(usersTable).where(eq(usersTable.id,id));
    if (result.length === 0) {
      return err(new Error("User Not Found"));
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

  async getLettersAllWithUserIDSent(userId:number): Promise<Result<Array<Omit<typeof lettersTable.$inferSelect,"time_send"|"time_receive">&{time_send:number,time_receive:number}>,Error>> {
    const result = await this.db.select().from(lettersTable).where(and(or(eq(lettersTable.user_id_from,userId),eq(lettersTable.user_id_to,userId)),eq(lettersTable.is_sent,true)));
    if (result.length === 0) {
      return ok([]);
    }
    return ok(result.map((v)=>{return {...v,time_send:v.time_send.getTime(),time_receive:v.time_receive.getTime()}}));
  }

  async getLettersAllWithUserIDUnsent(userId:number): Promise<Result<Array<Omit<typeof lettersTable.$inferSelect,"time_send"|"time_receive">&{time_send:number,time_receive:number}>,Error>> {
    const result = await this.db.select().from(lettersTable).where(and(or(eq(lettersTable.user_id_from,userId),eq(lettersTable.user_id_to,userId)),eq(lettersTable.is_sent,false)));
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

  async getLetterIdsWithUserID(userId:number) {
    const result = await this.db.select({
      id: lettersTable.id,
    }).from(lettersTable).where(or(eq(lettersTable.user_id_from,userId),eq(lettersTable.user_id_to,userId)));
    if (result.length === 0) {
      return ok([]);
    } else {
      return ok(result.map((v)=>v.id));
    }
  }

  async getAllpublicLetter(): Promise<Result<Array<Omit<typeof lettersTable.$inferSelect,"time_send"|"time_receive">&{time_send:number,time_receive:number}>,Error>>{
    const result = await this.db.select().from(lettersTable).where(and(eq(lettersTable.is_public,true),eq(lettersTable.is_sent,true)));
    if (result.length === 0) {
      return ok([]);
    }
    return ok(result.map((v)=>{return {...v,time_send:v.time_send.getTime(),time_receive:v.time_receive.getTime()}}));
  }

  async letterstosend(): Promise<Result<Array<Omit<typeof lettersTable.$inferSelect,"time_send"|"time_receive">&{time_send:number,time_receive:number}>,Error>>{
    const now = new Date();
    const result = await this.db.select().from(lettersTable).where(and(lt(lettersTable.time_receive, now),eq(lettersTable.is_sent,false)));
    if (result.length === 0) {
      return ok([]);
    }
    return ok(result.map((v)=>{return {...v,time_send:v.time_send.getTime(),time_receive:v.time_receive.getTime()}}));
  }

  async deleteLetter(id:number,user_id_from:number) {
    await this.db.delete(lettersTable).where(and(eq(lettersTable.id,id),eq(lettersTable.user_id_from,user_id_from)));
  }

  async initViewCounter(letterId:number) {
    await this.db.insert(lettersViewsTable).values({views:1,id:letterId});
  }

  async getViewCountOfPubLetter(letterId:number) {
    const result = await this.db.select().from(lettersViewsTable).where(eq(lettersViewsTable.id,letterId));
    if (result.length === 0) {
      return null;
    } else {
      return result[0].views
    }
  }

  async setViewCountOfPubLetter(letterId:number,views:number) {
    await this.db.update(lettersViewsTable).set({views}).where(eq(lettersViewsTable.id,letterId));
  }

  async initOrIncrementViewCountOfPubLetter(letterId:number) {
    const count = await this.getViewCountOfPubLetter(letterId);
    if (count == null) {
      this.initViewCounter(letterId);
    } else {
      this.setViewCountOfPubLetter(letterId,count+1);
    }
  }

  async getAllViewCounts(): Promise<Array<{ id: number; views: number }>> {
    // 모든 view count를 id, views 형태로 반환
    const result = await this.db.select().from(lettersViewsTable);
    return result.map((v) => ({ id: v.id, views: v.views }));
  }

}
