const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");


const handleSubmit = (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    // fetch : URL 변경없이, JS로 request를 보낼 수 있게함
    if(text === "") return;
    fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        headers : {
            "Content-Type" : "application/json",
        },
        //req.body
        body : JSON.stringify({ text }),
    })
}

if(form) form.addEventListener("submit", handleSubmit);