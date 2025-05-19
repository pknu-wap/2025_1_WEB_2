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
app.use("/letter",letterRouter);

export default app;
