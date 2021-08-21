const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = `  ${text}`
    newComment.appendChild(icon);
    newComment.appendChild(span);
    // prepend() : element를 맨 위에 추가
    videoComments.prepend(newComment);
}


const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    // fetch : URL 변경없이, JS로 request를 보낼 수 있게함
    if(text === "") return;
    const { status } = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        headers : {
            "Content-Type" : "application/json",
        },
        //req.body
        body : JSON.stringify({ text }),
    });
    textarea.value = "";
    if(status === 201){
        addComment(text);
    }
}

if(form) form.addEventListener("submit", handleSubmit);