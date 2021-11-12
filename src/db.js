import mongoose from "mongoose";

//db.js파일이 servr.js에서 import 되면 자동 실행됨 실행은 얘가 맨 마지막 실행  좀느려서!
//database에 연결
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;
const handleOpen = () => console.log("Connected to DB✅");
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError);
db.once("open", (handleOpen));