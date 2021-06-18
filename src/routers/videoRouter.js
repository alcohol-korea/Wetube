import express from "express";
import { getEdit, getUpload , watch, postEdit, postUpload, deleteVideo } from "../controllers/videoController";
import { protectorMiddleware } from "../middleware";

const videoRouter = express.Router();


//js는 위에서 아래로 실행되어 upload가 밑에있을경우
// /upload 가 /:id 인것으로 express는 간주한다.
videoRouter.get("/:id([0-9a-f]{24})", watch);//정규식을 써도 template에서 upload한 videos의 view를 받지를 못하여 페이지가 나타나지 않는다
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(postUpload);

export default videoRouter;