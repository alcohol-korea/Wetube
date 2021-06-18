import express from "express";
//모든 파일은 자기만의 js 세께가 있다
//반드시 모든 파일에 express를 import해야한다
import {getJoin, getLogin, postJoin, postLogin} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middleware";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);//로그인 되지않은 상태에서 protector을 하면 로그인을 갈수 없으므로 무한루프가됨
rootRouter.get("/search",search);


export default rootRouter;