import express from "express";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middleware";

const app = express();

/*------------Middleware function--------------------------------------------------------------- */
//더 자세히 routes의 method,path,status code까지 넣어준다
const logger = morgan("dev"); //()안에 들어가는 것은 정보를 나타내는 유형
/*------------pug---------------------------------------------------------------------------------*/
app.set("view engine", "pug");//view engine이 pug임을 express저장한다
//1. pug설치 2. pug를 뷰엔진으로 설정 3. 실제 pug파일 생성
//express는 views라는 폴더 안에서 파일을 찾음  
//view는 사용자가 보는 대상 default: 현재 작업 디렉토리에서 /views임
app.set("views", process.cwd() + "/src/views");
/*----------Middleware--------------------------------------------------------------- */
//middle wares make routes use them
//맨위에 있는 middleware은 모든 routes에 쓸수 있다.
app.use(logger);
app.use(express.urlencoded({extended: true}));
//session middleware
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl:process.env.DB_URL})//mongodb에 sessions저장
})
);//1초마다 까먹는 친구와 대화하는것 => 매번까먹을떄마다 id를 알려주면 폰번호를 알려줌
/*app.use((req, res, next) => {
    req.sessionStore.all((error, sessions) => {
      console.log(sessions);
      next();
    });//sessions 를 보여줌
  });// 강의 다시 듣기!!!!!!!!!!!!!! 7.7~7.8 //session을 볼수 잇는이유는 session middleware다음에 localmiddleware가 있기때문이다*/
  app.use(localsMiddleware);
/*------------Routers--------------------------------------------------------------- */

app.use("/", rootRouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);

export default app;
