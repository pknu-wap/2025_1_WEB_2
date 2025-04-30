import { app } from '#lib/app/index.ts';
import api from './api/index.ts';
import express from "express";
import { DBController } from './db/index.ts';
import { drizzle } from 'drizzle-orm/mysql2';
import {createHash} from "crypto";
import { generateToken } from './jwt/jwt.ts';
import { expressjwt, Request } from 'express-jwt';
import { CorsOptions, CorsOptionsDelegate, default as cors } from 'cors';
import {z} from "zod";


const db = drizzle(process.env.DATABASE_URL!);
const SALT = process.env.SALT!;

const dbController = new DBController(db);

const allowlist = ["http://localhost:3000","http://127.0.0.1:3000","https://slow-postbox.netlify.app"]

const corsOptionsDelegate: CorsOptionsDelegate = (req,callback) => {
    let corsOptions : CorsOptions;
    if (allowlist.indexOf(req.headers.origin) !== -1) {
        corsOptions = {origin:true,credentials:true,allowedHeaders:["Content-Type","Authorization"]};
    } else {
        corsOptions = {origin:false};
    }
    callback(null,corsOptions);
}

app.use('/api/v1', api)
app.use(express.json());
app.use(cors(corsOptionsDelegate));


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

app.get("/account/my",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async (req: Request<{id:number,email: string,name:string}>, res)=>{
    res.send({id:req.auth.id,email:req.auth.email,name:req.auth.name});
});

const zLetterCreate = z.object({
    title:z.string(),
    content:z.string(),
    user_id_from:z.number(),
    user_id_to:z.number(),
    time_send:z.number().transform((v)=> {let a = new Date();a.setTime(v);return a;}),
    time_receive:z.number().transform((v)=> {let a = new Date();a.setTime(v);return a;}),
    email_get_notify_receive:z.string().email(),
    is_public:z.boolean()
});

app.post("/letter/create",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const parseResult = zLetterCreate.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400);
        res.send({error: parseResult.error.toString()});
        return;
    }
    if (req.auth.id !== parseResult.data.user_id_from) {
        res.status(422);
        res.send({error: "req.auth.id !== result.data.user_id_from"});
        return;
    }
    const body = parseResult.data;
    const dbResult = await dbController.addLetter({
        title:body.title,
        content: body.content,
        user_id_from: body.user_id_from,
        user_id_to: body.user_id_to,
        time_send: body.time_send,
        time_receive: body.time_receive,
        email_get_notify_receive: body.email_get_notify_receive,
        is_public: body.is_public,
        is_sent: false,
    });
    if (dbResult.isOk()) {
        res.send(dbResult.value); // letterId
    } else {
        res.status(500);
        res.send(dbResult.error.message);
    }
});

export default app;