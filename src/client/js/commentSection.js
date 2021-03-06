const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".deleteBtn");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = `  ${text}`
    const span2 = document.createElement("span");
    span2.innerText = `  ❌`
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    // prepend() : element를 맨 위에 추가
    videoComments.prepend(newComment);
    span2.addEventListener("click",handleDelete);
}

const deleteComment = (target) => target.remove()

const handleSubmit = async (e) => {
    e.preventDefault();
    const textarea = form.querySelector(".video__comment-input");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    // fetch : URL 변경없이, JS로 request를 보낼 수 있게함
    if(text === "") return;
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"POST",
        headers : {
            "Content-Type" : "application/json",
        },
        //req.body
        body : JSON.stringify({ text }),
    });
    if(response.status === 201){
        textarea.value = "";
        const { newCommentId }  = await response.json();
        addComment(text, newCommentId);
    }
}

const handleDelete = async (event) => {
    const targetComment = event.target.parentNode;
    const commentId = targetComment.dataset.id
    const response = await fetch(`/api/comments/${commentId}`, {
        method : "DELETE"
    });
    if(response.status === 200) deleteComment(targetComment);
}


if(form) form.addEventListener("submit", handleSubmit);
if(deleteBtn){
for(let i = 0; i < deleteBtn.length; i++){
    deleteBtn[i].addEventListener("click", handleDelete)
    }
}