import express from "express"
import { expressjwt,Request } from "express-jwt";
import {createHash} from "crypto";
import { generateToken } from '../jwt/jwt.ts';
import { DB } from "src/db/index.ts";

const SALT = process.env.SALT!;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

const router = express.Router();
const dbController = DB.getInstance().dbController;

router.post("/login", async (req, res)=>{
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
router.post("/create", async(req, res)=>{
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



router.get("/my",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async (req: Request<{id:number,email: string,name:string}>, res)=>{
    res.send({id:req.auth.id,email:req.auth.email,name:req.auth.name});
});

export {router as accountRouter};