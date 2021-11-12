import express from "express";
import {
	getEdit,
	postEdit,
	logout,
	see,
	startGithubLogin,
	finishGithubLogin,
	getChangePassword,
	postChangePassword,
} from "../controllers/userController";
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
//multer -> uploadFile이라는 middleware를 사용할거고 오직 하나의 file만 업로드 , 그건 avatar에서 가져올거야
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;