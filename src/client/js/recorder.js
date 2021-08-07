const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    // URL로 가는 대신, 다운로드하게 만들어줌
    a.download = "MyRecording.webm"
    document.body.appendChild(a);
    a.click();
}

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);
    recorder.stop();

}

const handleStart = () => {
    startBtn.innerText = "Stop Recoring";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
        // 브라우저 메모리에서만 가능한 URL을 만들어줌
        videoFile = URL.createObjectURL(event.data)
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    recorder.start();
}

const init = async() => {
    stream = await navigator.mediaDevices
    .getUserMedia({
        audio:false, 
        video: {width:250, height:500},
    });
    video.srcObject = stream;
    video.play();
}

init();
startBtn.addEventListener("click", handleStart);