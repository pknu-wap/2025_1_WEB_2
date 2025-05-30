import { app } from '#lib/app/index.ts';
//import api from './api/index.ts';
import express from "express";
import { CorsOptions, CorsOptionsDelegate, default as cors } from 'cors';
import { accountRouter } from './api/account.ts';
import { letterRouter } from './api/letter.ts';
import cron from 'node-cron';
import { handler } from './api/sendemail.ts';

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

cron.schedule('0 12 * * *', async () => {
    console.log('Running daily email send task at 12:00 PM');
    handler();
},{"timezone": "Asia/Seoul"}); // Set timezone to Asia/Seoul

if (process.argv.find((v)=>v.includes("--send-email-now"))) {
    console.log("Sending Email Now")
    handler();
    console.log("Sending Email End")
}

export default app;
