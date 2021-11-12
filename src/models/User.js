import bcrypt from "bcrypt";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	avatarUrl: String,
	socialOnly: { type: Boolean, default: false },
	username: { type: String, required: true, unique: true },
	password: { type: String },
	name: { type: String, required: true },
	location: String,
	//videos는 Video model에 연결된 ObjectId로 구성된 array야 
	videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});
// hashing
//여기서의 this는 위에서 create되는 User를 가리킨다.
userSchema.pre('save', async function () {
	//password가 수정 됐을 때만 hash 하도록
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 5);
	}
});

const User = mongoose.model("User", userSchema);

export default User;