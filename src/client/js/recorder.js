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

    // "-ss", "00:00:00" : 해당 순간으로 갈 수 있게함
    // "-frames:v", "1" : 이동한 시간의 스크린샷 한장을 찍음
    await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg")
    
    // return 값 => Uint8Array : unsigned integer : 양의정수
    const mp4File = ffmpeg.FS("readFile", "output.mp4");
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg")

    // binary data를 사용하려면 buffer를 사용해야함.
    console.log(mp4File);
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"})
    const thumbBlob = new Blob([thumbFile.buffer], {type:"image/jpg"})

    // blob URL은, url을 통해서 파일에 접근하는 방법
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    a.href = mp4Url;
    // URL로 가는 대신, 해당 URL을 다운로드하게 만들어줌
    a.download = "MyRecording.mp4"
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "MyThumbnail.jpg"
    document.body.appendChild(thumbA);
    thumbA.click();

    // 다운로드가 완료되면, 필요없는 URL들을 지워줌으로써 브라우저가 더 빨라짐
    ffmpeg.FS("unlink", "recording.webm");
    ffmpeg.FS("unlink", "output.mp4");
    ffmpeg.FS("unlink", "thumbnail.jpg");
    
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
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