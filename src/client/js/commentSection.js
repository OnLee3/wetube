const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = (e) => {
    e.preventDefault();
    const text = textarea.value;
    const video = videoControls.dataset.id;
}

form.addEventListener("submit", handleSubmit);