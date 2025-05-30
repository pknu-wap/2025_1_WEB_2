import express from "express";
import { expressjwt,Request } from "express-jwt";
import { DB } from "src/db/index.ts";
import {z} from "zod";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;

const router = express.Router();

const dbController = DB.getInstance().dbController;
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

router.post("/create",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
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
      res.send({error: "time_send > time_receive"});
      return;
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
  id:z.string().transform((v)=>Number(v))
});

router.get("/get",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
  const parseResult = zLetterGet.safeParse(req.query);
  if (!parseResult.success) {
      res.status(400);
      res.send({error: parseResult.error.toString()});
      return;
  }
  const body = parseResult.data;
  if (isNaN(parseResult.data.id)) {
      res.status(400);
      res.send({error: "id is not number"});
      return;
  }
  const letter = await dbController.getLetter(body.id);
  if (letter.isErr()) {
      res.status(500);
      res.send({error:letter.error});
      return;
  }
  if (letter.value === null) {
      res.status(404);
      res.send({error:"404 Not Found"});
      return;
  }
  if (!letter.value.is_public && req.auth.id !== letter.value.user_id_from && req.auth.id !== letter.value.user_id_to) {
      res.status(422);
      res.send({error:"Not public, and you are not sender nor receiver"});
  }
  res.send({letter: letter.value});
});


router.get("/list_all_ids_of_me",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
  const allLetters = await dbController.getLetterIdsWithUserID(req.auth.id);
  if (allLetters.isOk()) {
      res.send({arr_id:allLetters.value});
  } else {
      res.send(500);
      res.send({error:allLetters.error.message});
  }
});

router.get("/get_all_of_me",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
  const allLetters = await dbController.getLettersAllWithUserID(req.auth.id);
  if (allLetters.isOk()) {
      res.send({arr_letter:allLetters.value});
  } else {
      res.status(500);
      res.send({error:allLetters.error.message});
  }
});

router.get("/get_all_of_me/sent",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const sentLetters = await dbController.getLettersAllWithUserIDSent(req.auth.id);
    if (sentLetters.isOk()) {
        res.send({arr_letter:sentLetters.value});
    } else {
        res.status(500);
        res.send({error:sentLetters.error.message});
    }
});

router.get("/get_all_of_me/unsent",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}), async(req:Request<{id:number,email: string,name:string}>, res)=>{
    const unsentLetters = await dbController.getLettersAllWithUserIDUnsent(req.auth.id);
    if (unsentLetters.isOk()) {
        res.send({arr_letter:unsentLetters.value});
    } else {
        res.status(500);
        res.send({error:unsentLetters.error.message});
    }
});

router.get("/get_all_public", async(req,res)=>{
    const publicLetters = await dbController.getAllpublicLetter();
    if (publicLetters.isOk()) {
        res.send({arr_letter:publicLetters.value});
    } else {
        res.status(500);
        res.send({error:publicLetters.error.message});
    }
});

const zDelete = z.object({letterId:z.number()});
router.post("/delete",expressjwt({secret:JWT_SECRET_KEY,algorithms:["HS256"]}),async(req:Request<{id:number,email:string,name:string}>,res)=>{
    const r = zDelete.safeParse(req.body)
    if (!r.success) {
        res.status(400);
        res.send(r.error.message);
        return;
    }
    const rl = await dbController.getLetter(r.data.letterId);
    if (rl.isErr()) {
        res.status(500);
        res.send("/letter/delete getLetter Failed");
        return;
    }
    if (rl.value!.user_id_from !== req.auth!.id) {
        res.status(403);
        res.send("the letter is not by you");
        return;
    }
    await dbController.deleteLetter(r.data.letterId,req.auth!.id);
    res.send({});
})


export {router as letterRouter};
