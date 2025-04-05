import { boolean, foreignKey } from 'drizzle-orm/mysql-core';
import { bigint } from 'drizzle-orm/mysql-core';
import { datetime } from 'drizzle-orm/mysql-core';
import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255}).notNull(),
});

export const lettersTable = mysqlTable('letters_table', {
  id: serial().primaryKey(),
  title: varchar({ length: 180 }).notNull(),
  content: varchar({ length: 320 }).notNull(),
  user_id_from: bigint({mode:"number",unsigned:true}).notNull().references(()=>usersTable.id),
  user_id_to: bigint({mode:"number",unsigned:true}).notNull().references(()=>usersTable.id),
  time_send: datetime().notNull(),
  time_receive: datetime().notNull(),
  email_get_notify_receive: varchar({ length: 255 }).notNull(),
  is_public: boolean().notNull(),
  is_sent: boolean().notNull()
});