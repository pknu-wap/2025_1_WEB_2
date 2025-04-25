import 'dotenv/config';
import { lettersTable, usersTable } from './db/schema.ts';
import { DBController } from './db/index.ts';
import { drizzle } from 'drizzle-orm/mysql2';

import app from './app.ts'

const port = process.env.PORT || 80

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})



// async function main() {
//   await db.delete(lettersTable)
//   await db.delete(usersTable)
//   const userId = await ALPHA__addUser()
//   if (userId.isErr()) {
//     throw userId.error
//   }

//   const users = await db.select().from(usersTable);
//   console.log('Getting all users from the database: ', users)

//   const date_receive = new Date();
//   date_receive.setHours(date_receive.getHours() + 1);

//   await addLetter({
//     user_id_from: userId.value,
//     user_id_to: userId.value,
//     title: "test letter",
//     "content": "test content",
//     "email_get_notify_receive": "test@example.com",
//     "is_public": false,
//     "is_sent": false,
//     "time_send": new Date(),
//     "time_receive": date_receive,
//   });

//   const letter_table = await db.select().from(lettersTable)
//   console.log(letter_table)
// }

// main();