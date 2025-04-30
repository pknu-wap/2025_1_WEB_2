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

// app.use('/api/v1', api)
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
    const body = parseResult.data;
    if (req.auth.id !== body.user_id_from) {
        res.status(422);
        res.send({error: "req.auth.id !== result.data.user_id_from"});
        return;
    } else if (body.time_send > body.time_receive) {
        res.status(422);
        res.send({error: "time_send > time_receive"})
    }
    const letterId = await dbController.addLetter({
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
    if (letterId.isOk()) {
        res.send({id:letterId.value}); // letterId
    } else {
        res.status(500);
        res.send({error:letterId.error.message});
    }
});

const zLetterGet = z.object({
    id:z.number()
});

app.get("/letter/get",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const parseResult = zLetterGet.safeParse(req.query);
    if (!parseResult.success) {
        res.status(400);
        res.send({error: parseResult.error.toString()});
        return;
    }
    const body = parseResult.data;
    const letter = await dbController.getLetter(body.id);
    if (letter.isErr()) {
        res.status(500);
        res.send(letter.error);
        return;
    }
    if (letter.value === null) {
        res.status(404);
        res.send("404 Not Found");
        return;
    }
    if (!letter.value.is_public && req.auth.id !== letter.value.user_id_from && req.auth.id !== letter.value.user_id_to) {
        res.status(422);
        res.send("Not public, and you are not sender nor receiver");
    }
    res.send({letter: letter.value});
});


app.get("/letter/list_all_ids_of_me",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const allLetters = await dbController.getLetterIdsWithUserID(req.auth.id);
    if (allLetters.isOk()) {
        res.send({arr_id:allLetters.value});
    } else {
        res.send(500);
        res.send({error:allLetters.error.message});
    }
});

app.get("/letter/get_all_of_me",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const allLetters = await dbController.getLettersAllWithUserID(req.auth.id);
    if (allLetters.isOk()) {
        res.send({arr_letter:allLetters.value});
    } else {
        res.status(500);
        res.send({error:allLetters.error.message});
    }
});

export default app;