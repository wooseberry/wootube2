import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { async } from 'regenerator-runtime';

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
	input: "recording.webm",
	output: "output.mp4",
	thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
	const a = document.createElement("a");
	a.href = fileUrl;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
};

const handleDownload = async () => {
	//log:true = 콘솔확인을 위해서
	const ffmpeg = createFFmpeg({
		corePath: "https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js",
		log: true
	});
	//await 하는 이유는 사용자가 소프트웨어를 사용할 것이기 때문(프로그램 다운시간,javascript가 아닌 코드 사용)
	await ffmpeg.load();
	//writeFile,readFile,unlink
	//binary data = videoFile같은거(여기서 = blobURL)
	ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
	//-i = input
	//ffmpeg.run 은 가상 컴퓨터에 이미 존재하는 파일을 input으로 받는 것
	//우리가 이미 recording.webm이라는 파일을 만들어 놔서 이렇게 할 수 있음
	//요약 : recording.webm이라는 파일을 input 받아서 초당 60프레임으로 output.mp4로 변환
	await ffmpeg.run("-i", files.input, "-r", "60", files.output);
	//특정시간의 특정 프레임
	await ffmpeg.run(
		"-i",
		files.input,
		"-ss",
		"00:00:01",
		"-frames:v",
		"1",
		files.thumb
	);

	//readFile의 return 값은 Unit8Array(unsigned integer)수많은 숫자들로 표현된 자바스크립트 방식의 파일
	const mp4File = ffmpeg.FS("readFile", files.output);
	const thumbFile = ffmpeg.FS("readFile", files.thumb);
	//JS에서 파일같은 객체를 만드는 방법 : blob (한 마디로 binary 정보를 가지고 있는 파일)
	//Unit8Array로 부터 blob을 만들 수는 없지만 ArrayBuffer로는 만들 수 있다.
	//*mp4배열의 raw data, 즉 binary data에(실제파일) 접근 하려면 mp4File.buffer를 사용해야해(*ArrayBuffer-js)
	//blob은 배열안에 배열들을 받을 수 있다.
	const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
	const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

	const mp4Url = URL.createObjectURL(mp4Blob);
	const thumbUrl = URL.createObjectURL(thumbBlob);
	//makL a fake button
	//파일을 저장하는 function 없이 링크를 생성해서 download 라는 property를 추가
	downloadFile(mp4Url, "MyRecording.mp4");
	downloadFile(thumbUrl, "MyThumbnail.jpg");

	ffmpeg.FS("unlink", files.input);
	ffmpeg.FS("unlink", files.output);
	ffmpeg.FS("unlink", files.thumb);

	URL.revokeObjectURL(mp4Url);
	URL.revokeObjectURL(thumbUrl);
	URL.revokeObjectURL(videoFile);
};

const handleStop = () => {
	startBtn.innerText = "Download Recording";
	startBtn.removeEventListener("click", handleStop);
	startBtn.addEventListener("click", handleDownload);
	recorder.stop();
};

const handleStart = () => {
	startBtn.innerText = "Stop Recording";
	startBtn.removeEventListener("click", handleStart);
	startBtn.addEventListener("click", handleStop);
	recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
	//ondataavailable은 녹화가 멈추면 발생되는 event
	recorder.ondataavailable = (event) => {
		//이 createObjectURL은 브라우저 메모리에서만 가능한 URL을 만들어줘
		//여기 URL은 웹사이트 상에 존재하는 URL처럼 보이지만 실제로는 없어 
		//단순히 브라우저의 메모리를 가리키기만 하고 있는 URL일 뿐임
		videoFile = URL.createObjectURL(event.data);
		video.srcObject = null;
		video.src = videoFile;
		video.loop = true;
		video.play();
	};
	recorder.start();
};

const init = async () => {
	stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: true,
	});
	video.srcObject = stream;
	video.play();
};

init();

startBtn.addEventListener("click", handleStart);