import fetch from 'node-fetch';

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
	//if the video is playing,  pause it
	//Btn을 눌렀는데 비디오가 멈춰저 있으면 
	if (video.paused) {
		video.play();
		console.log(video);
	} else { // Btn 눌렀을때 비디오가 재생중이면 pause 실행
		video.pause();
	}
	//else play the video
	playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
//handlePause, handlePlay = text 변화를 위한 것인가
const handlePause = () => playBtn.innerText = "Play";
const handlePlay = () => playBtn.innerText = "Pause";
const handleMuteClick = (e) => {
	if (video.muted) {
		video.muted = false;
	} else {
		video.muted = true;
	}
	muteBtn.innerText = video.muted ? "unmuted" : "Muted";
	volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
	//range 값을 가져와서
	const { target: { value } } = event;
	if (video.muted) {
		video.muted = false;
		muteBtn.innerText = "Mute";
	}
	//video 실제 volume에 적용
	volumeValue = value;
	video.volume = value;
};
//일종의 트릭인데 이해안감
//시간이 00:00 이런 형태로 나오도록 
const formatTime = (seconds) =>
	new Date(seconds * 1000).toISOString().substr(14, 5);
const handleLoadedMetadata = () => {
	//영상의 전체시간을 formatTime의 인자로 넣어서 35초영상이면 35*1000으로 표현
	totalTime.innerText = formatTime(Math.floor(video.duration));
	timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
	currentTime.innerText = formatTime(Math.floor(video.currentTime));
	//timeline의 현재 값이 range bar에 반영
	timeline.value = Math.floor(video.currentTime);
};
//range값을 실제 video timeline 값으로
const handleTimelineChange = (event) => {
	const { target: { value } } = event;
	video.currentTime = value;
};


const handleFullScreen = () => {
	const fullscreen = document.fullscreenElement;
	if (fullscreen) {
		document.exitFullscreen();
		fullScreenIcon.classList = "fas = fa-expand";
	} else {
		videoContainer.requestFullscreen();
		fullScreenIcon.classList = "fas fa-compress";
	}
};
//내가 움직일 때마다 오래된 timeout을 취소하고 새로운 timeout 만듦
const hideControls = () => videoControls.classList.remove("showing");
const handleMouseMove = () => {
	if (controlsTimeout) {
		clearTimeout(controlsTimeout);
		controlsTimeout = null;
	}
	if (controlsMovementTimeout) {
		clearTimeout(controlsMovementTimeout);
		controlsMovementTimeout = null;
	}
	videoControls.classList.add("showing");
	controlsMovementTimeout = setTimeout(hideControls, 3000)
};
const handleMouseLeave = () => {
	controlsTimeout = setTimeout(hideControls, 3000);
};
const handleEnded = () => {
	const { id } = videoContainer.dataset;
	//fetch는 api에 요청 보낼때 씀
	//watch.pug에서 id를 남겨줘야함
	//id를 찾기 위해서 HTML element에 커스텀 데에터를 어떻게 저장할까
	//pug한테 video id의 정보를 HTML의 어딘가에 저장하라고(렌더링할때) 알려줄거야  data attribute라는 걸 사용해서
	fetch(`/api/videos/${id}/view`, {
		method: "POST",
	});
};

playBtn.addEventListener("click", handlePlayClick);

muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);

video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);

videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
//registerView할때 쓰는  거
video.addEventListener("ended", handleEnded);

fullScreenBtn.addEventListener("click", handleFullScreen);


/*
loadedmetadata
미디어의 메타 데이터가 로드 되었을 때를 나타냄
메타 데이터는 우리가 유용하게 사용할 수 있는 동영상의 재생시간과 같은 것을 의미한다.
미디어가 로드되기 전에, 먼저 메타 데이터를 뽑아와서 활용할 수 있다.

loaddata
미디어의 메타 데이터가 로드 되었을 때를 나타낸다
여기서 프레임은 미디어의 대한 전체 프레임이 아닌 첫프레임 또는 현재 프레임을 뜻 할 수있다.
즉,조금이라도 다운로드가 되었을 때이고, 이러한 의미는 재생할 수 있다는 것을 알아차릴 수 있다.
하지만 주의해야 할 것은 로드된 데이터가 재생에 있어서, 충분하다고 보장하지 않는다.
즉,loadeddata 이벤트가 발생한 시점에서 play()메소드를 호출하면, 재생이 실패할 수도 있다.
메타 데이터를 우선 가져오기에, loadedmetadata 이벤트가 발생한 후에, loadeddata 이벤트가 발생한다고 볼 수 있다.
즉, loadeddata 에서도 메타 데이터를 활용할 수 있다는 것이다.

canplay
재생을 할 수 있는 정도의 충분한 데이터가 로드되었을 때, 미디어는 재생할 수 있다고 판단하고 이벤트를 호출한다.
즉, canplay 이벤트는 미디어에 대한 재생을 할 수 있다는 것을 나타낸다.
loadeddata 에서는 재생을 보장하지 못했지만, 여기서는 재생을 보장한다.
하지만 재생을 보장하지만, 버퍼로 인해 중단될 수 있다.
즉, 재생을 보장한다는 것은, 전체 재생이 아닌 현재 시점에서 재생을 할 수 있는지 없는지를 나타낸다.
그리고 다른 면에서 조금 더 생각해보면, canplay 이벤트는 loadeddata 이벤트가 일어난 후에 호출된다.

canplaythrough
canplay 이벤트와 동일하지만, 차이점은 전체 미디어가 중단없이 재생할 수 있을 때 호출된다.
canplay 이벤트가 전체 재생을 보장하지는 못하였다면, canplaythrough 는 중단없이 전체 재생을 보장하는 목적이다.
현재 로드 속도를 유지한다고 가정하고, 중단이 되지 않는다고 판단하면 호출된다.
하지만 이것 또한 가정이기때문에, canplay 이벤트보다는 전체 재생을 보장하겠지만, 확신할 수는 없다.
그리고 다른 면에서 조금 더 생각해보면, canplaythrough 이벤트는 canplay 이벤트가 일어난 후에 호출된다.

결과적으로 순서는 loadedmetadata -> loadeddata -> canplay -> canplaythrough 를 의미할 수 있다.
*/