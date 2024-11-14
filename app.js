"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

/* page */
const page = {
  menu: document.querySelector(".menuList"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progressPercent"),
    progressFill: document.querySelector(".progressFill"),
  },
  body: {
    posts: document.querySelector(".posts"),
    post: document.querySelectorAll(".post"),
  },
};

/* utils */
function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitsArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitsArray)) {
    habbits = habbitsArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// render

function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("mainBarBtn");
      element.addEventListener("click", () => {
        rerender(habbit.id);
      });
      element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="${habbit.name}">`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add("activeBtn");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("activeBtn");
    } else {
      existed.classList.remove("activeBtn");
    }
  }
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderBody(activeHabbit);
}

function renderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressFill.style.width = `${progress.toFixed(0)}%`;
}
function renderBody(activeHabbit) {
  page.body.posts.innerHTML = "";
  for (const [index, day] of activeHabbit.days.entries()) {
    const post = document.createElement("div");
    post.classList.add("post");

    post.innerHTML = `<div class="leftOfPost">День ${index + 1}</div>
    <div class="rightOfPost">
      <p class="text">${day.comment}</p>
      <button type="button" class="removeBtn">
        <img src="images/delete.svg" alt="Кнопка удалить" />
      </button>
    </div>`;
    page.body.posts.appendChild(post);
  }
  const newComment = document.createElement("form");
  newComment.setAttribute("onsubmit", "addDays(event)");
  newComment.classList.add("post");
  newComment.innerHTML = `<div class="leftOfPost">День ${
    activeHabbit.days.length + 1
  }</div>
  <div class="rightOfPost">
  <img src="images/comment.svg" alt="Комментарий" class="commentImg" />
    <input name="comment" type="text" class="addMessage" placeholder="Комментарий" />
    <button type="submit" class="commentBtn">Готово</button>
  </div>`;
  page.body.posts.appendChild(newComment);
}
function addDays(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });
  form["comment"].value = "";
  rerender(globalActiveHabbitId);
  saveData();
}
// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
