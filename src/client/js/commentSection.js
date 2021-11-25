const { default: fetch } = require('node-fetch');
const { async } = require('regenerator-runtime');

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll('.deleteBtn');
//.deelBtn을 가진 모든 것들을 가져온다.
//댓글은 여러개일 수 있으므로

const handleDelete = async (event) => {
	event.preventDefault();
	console.log("dd");
	const targetComment = event.target.parentElement;
	const { id } = targetComment.dataset;
	const videoId = videoContainer.dataset.id;
	const response = await fetch(`/api/videos/${videoId}/comment/${id}/delete`, {
		method: "DELETE",
	});
	if (response.status === 200) {
		targetComment.remove();
	}
};


const addComment = (text, id) => {
	const videoComments = document.querySelector(".video__comments ul");
	const newComment = document.createElement("li");
	newComment.dataset.id = id;
	newComment.className = "video__comment";
	const icon = document.createElement("i");
	icon.className = "fas fa-comment";
	const span = document.createElement("span");
	span.innerText = ` ${text}`;
	const span2 = document.createElement("span");
	span2.innerText = "❌";
	newComment.appendChild(icon);
	newComment.appendChild(span);
	newComment.appendChild(span2);
	videoComments.prepend(newComment);
	span2.addEventListener("click", handleDelete);
};

//JS는 event 를 function의 argument로 넘겨줘

const handleSubmit = async (event) => {
	//이건 브라우저가 항상 하는 동작을 멈추도록 맘들거야
	event.preventDefault();
	const textarea = form.querySelector("textarea");
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;
	//우리는 server에 text를 보내야해
	if (text === "") {
		return;
	}
	//여기 await를 하는 이유는  ftch는 backend로 가야하고-> backend는 DB랑 뭔가를 하고 나서 
	//status code 를 return을 하고 -> 그러고 나서 backend가 우리에게 돌아오는데
	//이게 시간이 좀걸려서 해주는것
	//안해도 작동은 되는데 페이지를 리로드했을때 fetch가 끝나지 않았다면
	const response = await fetch(`/api/videos/${videoId}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		//브라우저와 서버에 object 를 보낼 수 없어 왜냐면 브라우저와 서버는 이걸 받아서 string으로 만들어 버리거든 
		body: JSON.stringify({ text })
	});
	//await 하던 fetch동작이 끝났을 때에만 실행되도록
	if (response.status === 201) {
		textarea.value = "";
		const { newCommentId } = await response.json();
		addComment(text, newCommentId);
	}
};


//form 안에 있는 button을 누르면 JS는 form을 제출해
if (form) {
	form.addEventListener("submit", handleSubmit);
}
//이부분 잘 모르겠음
for (const btn of deleteBtns) {
	btn.addEventListener('click', handleDelete);
}



//delBtn.addEventListener("click", deleteComment);

