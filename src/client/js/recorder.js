import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {

    const ffmpeg = createFFmpeg({
        log:true
    });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile))

    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4")

    const a = document.createElement("a");
    a.href = videoFile;
    // URL로 가는 대신, 해당 URL을 다운로드하게 만들어줌
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
    // recorder.stop()하면 실행하는 내용
    recorder.ondataavailable = (event) => {
        // 브라우저 메모리에서만 사용 가능한 URL을 만들어줌
        videoFile = URL.createObjectURL(event.data)
        console.log(videoFile);
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
        video: true,
    });
    video.srcObject = stream;
    video.play();
}

init();
startBtn.addEventListener("click", handleStart);