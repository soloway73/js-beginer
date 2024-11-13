"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";

/* page */
const page = {
  menu: document.querySelector(".menuList"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progressPercent"),
    progressFill: document.querySelector(".progressFill"),
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
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
}

function renderHead(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressFill.style.width = `${progress.toFixed(0)}%`;
}

// init
(() => {
  loadData();
  rerender(habbits[0].id);
})();
