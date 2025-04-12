import { app } from '#lib/app'
import expressWs from 'express-ws'
import api from './api/index.ts'
import * as express from "express"
import { DBController } from './db/index.ts';
import { drizzle } from 'drizzle-orm/mysql2';
import {createHash} from "crypto"
import { generateToken } from './jwt/jwt.ts';

const db = drizzle(process.env.DATABASE_URL!);
const SALT = process.env.SALT!;

const dbController = new DBController(db);


app.use('/api/v1', api)
app.use(express.json());


app.post("/login", async (req, res)=>{
    const {email, password} = req.body;
    const passwordhash = createHash("sha256").update(password+SALT).digest("base64");
    const user = await dbController.getUser(email);
    if (user.isOk()) {
        if (user.value.passwordHash !== passwordhash) {
            res.send({error: "Wrong Password"});
        }
        const token = generateToken({id:user.value.id, email:user.value.email, name:user.value.name});
        res.send({token});
    } else {
        res.send({error: "Not Registered with this email"})
    }
})
app.post("/create", async(req, res)=>{
    const {email, name, password} = req.body;
    const passwordhash = createHash("sha256").update(password+SALT).digest("base64");
    const result = await dbController.addUser(email,name,passwordhash);
    if(result.isOk()){
        res.send({id:result.value})
    }
    else{
        res.send({error:result.error.message})
    }
    // res.send(`${email} ${name} ${password}`);
})

export default app