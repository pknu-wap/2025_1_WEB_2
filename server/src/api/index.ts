import { app } from '#lib/app'
import express from 'express'
import expressWs from 'express-ws'
import fs from "fs/promises";

expressWs(app)

const router = express.Router();

(async() => {
    const read_file = await fs.readFile('./log.txt');
    console.log(read_file.toString());
    console.log(read_file.toString().split('com#1').length-1,"번");
})();


router.ws('/', async(ws, req) => {
    ws.send("Server Connected.");
    ws.on('message', async msg => {
        console.log(msg)
        if (msg.toString().startsWith("com#1")) {
          const result = await fs.writeFile("./log.txt", "com#1\n", {flag:'a'});
        }
    })
})

export default router