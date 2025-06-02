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

// const id = await dbController.addLetter({
//     title:",",
//     content:",",
//     email_get_notify_receive: ",",
//     time_send:new Date(),
//     time_receive: new Date(),
//     user_id_from:1,
//     user_id_to:1,
//     is_public:true,
//     is_sent:true
// });

// if (id.isOk()) {
//     //const a = await dbController.getViewCountOfPubLetter(id.value)
//     // const a = 2;
//     await dbController.initOrIncrementViewCountOfPubLetter(id.value);
// }

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
  await dbController.initOrIncrementViewCountOfPubLetter(letter.value.id);
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
});

router.get("/view_count",async (req,res)=>{
    const parseResult = zLetterGet.safeParse(req.query);
    if (!parseResult.success) {
        res.status(400);
        res.send({error: parseResult.error.toString()});
        return;
    }
    const r = await dbController.getViewCountOfPubLetter(parseResult.data.id);
    if (r == null) {
        res.status(404);
        res.send("Not Found");
    } else {
        res.send({viewCount:r});
    }
});

router.get("/list_by_view_count", async (req, res) => {
  // 모든 공개 편지 가져오기
  const publicLettersResult = await dbController.getAllpublicLetter();
  if (!publicLettersResult.isOk()) {
    res.status(500);
    res.send({ error: publicLettersResult.error.message });
    return;
  }
  const publicLetters = publicLettersResult.value;

  // view count 정보 가져오기
  const viewCounts = await dbController.getAllViewCounts(); // [{id, views}]
  const viewCountMap = new Map(viewCounts.map((v) => [v.id, v.views]));

  // 각 편지에 viewCount 추가 (없으면 0)
  const lettersWithView = publicLetters.map((letter) => ({
    ...letter,
    viewCount: viewCountMap.get(letter.id) || 0,
  }));

  // viewCount 기준 내림차순 정렬
  lettersWithView.sort((a, b) => b.viewCount - a.viewCount);

  res.send({ arr_letter: lettersWithView });
});

export {router as letterRouter};
