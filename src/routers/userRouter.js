import express from "express";
import { getEdit, postEdit, logout, see, startGithubLogin, finishGithubLogin } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middleware";

const userRouter = express.Router();

// /users + /edit => userRouter.get("/edit",edit); 
userRouter.get("/logout", protectorMiddleware ,logout);// login된 상태에서 logout가능
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start",publicOnlyMiddleware,startGithubLogin);
userRouter.get("/github/finish",publicOnlyMiddleware,finishGithubLogin);// giyhub에있는 callback URL 을 만들어주었기 때문에 안만들어도 됨
userRouter.get(":id", see);

export default userRouter;
