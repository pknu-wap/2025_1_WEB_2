import { app } from '#lib/app/index.ts';
import expressWs from 'express-ws';
import api from './api/index.ts';
import * as express from "express";
import { DBController } from './db/index.ts';
import { drizzle } from 'drizzle-orm/mysql2';
import {createHash} from "crypto";
import { generateToken } from './jwt/jwt.ts';
import { expressjwt, Request } from 'express-jwt';

const db = drizzle(process.env.DATABASE_URL!);
const SALT = process.env.SALT!;

const dbController = new DBController(db);


app.use('/api/v1', api)
app.use(express.json());


app.post("/account/login", async (req, res)=>{
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        res.send("Bad Request")
        return;
    }
    const passwordhash = createHash("sha256").update(password+SALT).digest("base64");
    const user = await dbController.getUser(email);
    if (user.isOk()) {
        if (user.value.passwordHash !== passwordhash) {
            res.status(422);
            res.send({error: "Wrong Password"});
        } else {
            const token = generateToken({id:user.value.id, email:user.value.email, name:user.value.name});
            res.send({token});
        }
    } else {
        res.status(422);
        res.send({error: "Not Registered with this email"})
    }
});
app.post("/account/create", async(req, res)=>{
    console.log(req);
    const {email, name, password} = req.body;
    if (!email || !name || !password) {
        res.status(400);
        res.send("Bad Request")
        return;
    }
    const passwordhash = createHash("sha256").update(password+SALT).digest("base64");
    const result = await dbController.addUser(email,name,passwordhash);
    if(result.isOk()){
        res.send({id:result.value});
    }
    else{
        res.status(422);
        res.send({error:result.error.message});
    }
    // res.send(`${email} ${name} ${password}`);
});

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

app.get("/account/my",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async (req: Request<{id,email,name}>, res)=>{
    res.send({id:req.auth.id,email:req.auth.email,name:req.auth.name});
})

export default app