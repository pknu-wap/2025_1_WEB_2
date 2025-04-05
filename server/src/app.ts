import { app } from '#lib/app'
import expressWs from 'express-ws'
import api from './api'
import * as express from "express"
import { DBController } from './db/index.ts';
import { drizzle } from 'drizzle-orm/mysql2';
import {createHash} from "crypto"

const db = drizzle(process.env.DATABASE_URL!);
const SALT = process.env.SALT!;

const dbController = new DBController(db);


app.use('/api/v1', api)
app.use(express.json());


app.post("/login", (req, res)=>{
    const {email, password} = req.body;
    res.send(`${email} ${password}`);
})
app.post("/create", async(req, res)=>{
    const {email, name, password} = req.body;
    const passwordhash = createHash("sha256").update(password+SALT).digest("base64")
    const result = await dbController.addUser(email,name,passwordhash)
    if(result.isOk()){
        res.send({id:result.value})
    }
    else{
        res.send({error:result.error})
    }
    // res.send(`${email} ${name} ${password}`);
})

export default app