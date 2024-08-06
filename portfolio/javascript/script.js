

let imgContainer = document.querySelector(".img-container");
// const button = document.getElementById("SubmitBtn")
setInterval(() => {
        let last = imgContainer.firstElementChild;
        last.remove();
        imgContainer.appendChild(last);
      }, 2500);

const button = document.addEventListener("click", SubmitForm)

const SubmitForm = (e) => {
  e.preventDefault();
  alert("aguthu")
}