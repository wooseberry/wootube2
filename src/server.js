import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from './middlewares';

const app = express();
const logger = morgan("dev");

//cwd(currentworkingDirectory) = 현재 작업 디렉토리는 노드를 시작하는 디렉토리
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));

//이 미들웨어가 웹사이트에 들어오는 모두를 기억 할거야
//서버가 브라우저에게 텍스트를 줘서 개별적으로 기억
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
})
);

app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
app.use(localsMiddleware);
//폴더 노출 static에는 너가 노출 시키고 싶은 폴더의 이름을 쓰면 돼
//이경로를 이해하지 못하니까 누군가 /uploads로 가려고 하면 uploads폴더의 내용을 보여주라는 것
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
//어디에도 작동하는 global middleware
//위치가 항상 위에 있어야 한다.





