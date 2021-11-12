import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
	//Boolean 부분 어떻게 쓰는지 이해안감
	//user controller에  로그인 확인후 req.session.loggedIn 이 true로 는 부분과 연결
	//locals를 이용해서 loggedIn을 체크 하는 이유는 locals Obj 가 
	//모든 pug template에서 접근 가능 하기 때문? 굳이res.render에서 변수로 보내지 않아도됨

	res.locals.loggedIn = Boolean(req.session.loggedIn);
	res.locals.siteName = "wetube";
	// || {} 을 쓰는 이유는 무엇인가?
	res.locals.loggedInUser = req.session.user || {};
	next();
};

export const protectorMiddleware = (req, res, next) => {
	if (req.session.loggedIn) {
		return next();
	} else {
		return res.redirect("/login");
	}
};
export const publicOnlyMiddleware = (req, res, next) => {
	if (!req.session.loggedIn) {
		return next();
	} else {
		return res.redirect("/users/my-profile");
	}
};

export const avatarUpload = multer({
	dest: "uploads/avatars/", limits: {
		fileSize: 3000000,
	}
});
export const videoUpload = multer({
	dest: "uploads/videos/", limits: {
		fileSize: 10000000,
	}
});