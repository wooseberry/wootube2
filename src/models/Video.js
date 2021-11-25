import mongoose from "mongoose";

//model의 형태 정의(schema)
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 },
    fileUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, minLength: 20 },
    //Date.now()라고 실행해주지 않아도 mongoDB와  mmongoose가 똑똑해서 알아서 실행해줌
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
    //ObjectId는 js에서 제공하는게 아니라 only mongoose코드에서만 사용 할 수 있기때문에 노란색이 아니야
    //ref 는 User model의 id를 참조하겠다 라는 거야
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});
//middleware는 무조건 model이 생선되기 저에 만들어야 한다
//[a,b,c]이렇게 배열 하나에 저장되기 때문에


videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags
        .split(",")
        .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
const Video = mongoose.model("Video", videoSchema);
export default Video;

