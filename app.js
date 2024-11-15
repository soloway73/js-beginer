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
  popup: {
    index: document.getElementById("addPopup"),
    form: document.querySelector(".popupForm"),
    close: document.querySelector(".popupClose"),
    iconField: document.querySelector(".popupForm input[name='icon']"),
    nameField: document.querySelector(".popupForm input[name='name']"),
    targetField: document.querySelector(".popupForm input[name='target']"),
  },
};

// toggle popup
function togglePopup() {
  page.popup.index.classList.toggle("coverHidden");
}
function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}
function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove("error");
    if (!fieldValue) {
      form[field].classList.add("error");
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}
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
  document.location.replace(document.location.pathname + "#" + activeHabbitId);
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
      <button type="button" class="removeBtn" onclick="removeDay(${index})">
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

  const data = validateAndGetFormData(event.target, ["comment"]);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });
  resetForm(event.target, ["comment"]);
  rerender(globalActiveHabbitId);
  saveData();
}
function removeDay(dayIndex) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.filter((day, index) => index !== dayIndex),
      };
    }
    return habbit;
  });
  rerender(globalActiveHabbitId);
  saveData();
}
// working with habbits

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(".icon.iconActive");
  activeIcon.classList.remove("iconActive");
  context.classList.add("iconActive");
}

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  });
  resetForm(event.target, ["name", "target"]);
  saveData();
  togglePopup();
  rerender(maxId + 1);
}

// init
(() => {
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit) => habbit.id == hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();
