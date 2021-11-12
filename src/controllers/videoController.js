import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
    const videos = await Video.find({})
        .sort({ createdAt: "desc" })
        .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner");
    if (!video) {
        //populate하면 owner object의 전체가 불러와짐 즉 User의 모든것을 볼 수있음

        return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    //이 부분을 왜 이렇게 해야하는지
    const videoModified = await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    };
    if (String(videoModified.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    };

    return res.redirect(`/videos/${id}`);
};



export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    //이 영상을 누가 업로드 하는지
    const {
        user: { _id },
    } = req.session;
    //multer는 req.file을 제공해주는데 이 file에 path가 있는거야
    //'path'를 req.file.path 에서 받은 뒤 이름을 fileUrl로 바꿀 수 있어 (es6)
    const { path: fileUrl } = req.file;
    const { title, description, hashtags } = req.body;
    try {
        const newVideo = await Video.create({
            title,
            description,
            //fileUrl: file,
            fileUrl,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        //session에서의 아이디인가
        //업로드되는 video에 업로드 하는  user의 id를  저장
        //?로그인되어있는 session의 _id를 가진 User document를 가져오고
        //그 document의 videos에 이 영상을 올리는 owenr의 id를 push
        const user = await User.findById(_id);
        //이거는 방금 만든 비디오의 id
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    //User DB에 남아있는 videos삭제
    user.videos.splice(user.videos.indexOf(id), 1);
    user.save();
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        //res.sstatus.render()처럼 렌더로 마무리 하지 않으면 연결을 끝낼 수 없기때문에
        //res.status(render전에 상태코드를 정하기만 하는것)가 아닌 sendStatus로 마무리 
        return res.sendStatus(404);
    }
    // 
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

/* posetEdit 부분 수정 안되는 코드
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
*/