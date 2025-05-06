import { app } from '#lib/app/index.ts';
//import api from './api/index.ts';
import express from "express";
import { CorsOptions, CorsOptionsDelegate, default as cors } from 'cors';
import { accountRouter } from './api/account.ts';
import { letterRouter } from './api/letter.ts';

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

app.get("/",async(req,res)=>{
    res.sendFile("/public/index.html",{root:process.cwd()});
});
app.use("/account",accountRouter);
app.use("/letter",letterRouter)

app.get("/letter/get_all_of_me/sent",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const sentLetters = await dbController.getsentLettersAllWithUserID(req.auth.id);
    if (sentLetters.isOk()) {
        res.send({arr_letter:sentLetters.value});
    } else {
        res.status(500);
        res.send({error:sentLetters.error.message});
    }
});

app.get("/letter/get_all_of_me/unsent",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const unsentLetters = await dbController.getunsentLettersAllWithUserID(req.auth.id);
    if (unsentLetters.isOk()) {
        res.send({arr_letter:unsentLetters.value});
    } else {
        res.status(500);
        res.send({error:unsentLetters.error.message});
    }
});

export default app;
