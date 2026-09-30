"use strict";

const whatsappBase = "https://wa.me/5521965645204";

const whatsappURL = (message) =>
  `${whatsappBase}?text=${encodeURIComponent(message)}`;

/* Ano do rodapé */

document.getElementById("year").textContent = new Date().getFullYear();

/* Links do WhatsApp */

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsappURL(
    "Olá, Caroll! Conheci seu site e gostaria de consultar os serviços e horários disponíveis.",
  );
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.href = whatsappURL(
    `Olá, Caroll! Vi seu site e gostaria de saber mais sobre ${link.dataset.service}, valores e horários disponíveis.`,
  );
});

/* Menu mobile */

const menu = document.querySelector(".menu");
const nav = document.getElementById("nav");

function closeMenu() {
  nav.classList.remove("open");

  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Abrir menu");
}

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");

  menu.setAttribute("aria-expanded", String(open));

  menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

/* Filtros da galeria */

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("active", item === button);

      item.setAttribute("aria-pressed", String(item === button));
    });

    const category = button.dataset.filter;

    document
      .querySelector(".gallery")
      .classList.toggle("filtered", category !== "todos");

    document.querySelectorAll(".photo").forEach((photo) => {
      photo.hidden =
        category !== "todos" && photo.dataset.category !== category;
    });
  });
});

/* Informações das fotos */

const photos = [
  {
    title: "Cherry muse",
    description:
      "Francesinha vermelha e delicadas cerejas: uma composição cheia de personalidade.",
  },
  {
    title: "Toque celestial",
    description:
      "Luas, estrelas e detalhes dourados em uma composição de nail art.",
  },
  {
    title: "Essência clássica",
    description: "A delicadeza da francesinha branca em um formato amendoado.",
  },
  {
    title: "Linhas de luz",
    description: "Linhas douradas, branco e brilho para um visual delicado.",
  },
  {
    title: "Black signature",
    description:
      "Francesinha preta com curvas brilhantes e detalhes de folhas.",
  },
  {
    title: "Vermelho manifesto",
    description: "Um vermelho intenso e brilhante para mãos que se destacam.",
  },
];

/* Ampliação e favoritos */

const dialog = document.getElementById("lightbox");

let currentPhoto = 0;
let photoTrigger = null;
let previousOverflow = "";

const saved = new Set();

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;

  const photo = photos[currentPhoto];
  const image = document.getElementById("lightbox-image");

  image.src = `assets/unhas-${String(currentPhoto + 1).padStart(2, "0")}.jpg`;

  image.alt = photo.description;

  document.getElementById("lightbox-title").textContent = photo.title;

  document.getElementById("photo-description").textContent = photo.description;

  document.getElementById("photo-number").textContent =
    `COLEÇÃO CAROLL / ${String(currentPhoto + 1).padStart(2, "0")}`;

  document.getElementById("photo-whatsapp").href = whatsappURL(
    `Olá, Caroll! Gostei da inspiração "${photo.title}" (foto ${currentPhoto + 1}) na coleção do seu site. Gostaria de conversar sobre um resultado nesse estilo e consultar valores e horários.`,
  );

  updateSaved();
}

function updateSaved() {
  const isSaved = saved.has(currentPhoto);

  document.getElementById("save-photo").textContent = isSaved
    ? "Remover dos favoritos"
    : "Salvar inspiração";

  document
    .getElementById("save-photo")
    .setAttribute("aria-pressed", String(isSaved));

  document.getElementById("saved-status").textContent = isSaved
    ? "Inspiração salva durante esta visita."
    : "";
}

document.querySelectorAll(".photo").forEach((button) => {
  button.addEventListener("click", () => {
    photoTrigger = button;

    showPhoto(Number(button.dataset.index));

    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialog.showModal();
  });
});

document
  .querySelector(".close")
  .addEventListener("click", () => dialog.close());

dialog.addEventListener("close", () => {
  document.body.style.overflow = previousOverflow;

  if (photoTrigger) {
    photoTrigger.focus();
  }
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

document
  .getElementById("previous")
  .addEventListener("click", () => showPhoto(currentPhoto - 1));

document
  .getElementById("next")
  .addEventListener("click", () => showPhoto(currentPhoto + 1));

dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(currentPhoto + 1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPhoto(currentPhoto - 1);
  }
});

document.getElementById("save-photo").addEventListener("click", () => {
  if (saved.has(currentPhoto)) {
    saved.delete(currentPhoto);
  } else {
    saved.add(currentPhoto);
  }

  updateSaved();
});

/* Ateliê interativo */

const form = document.getElementById("style-form");
const finish = document.getElementById("finish");

function styleSelection() {
  const color = form.querySelector('[name="cor"]:checked');

  const shape = form.querySelector('[name="formato"]:checked').value;

  return {
    color: color.value,
    hex: color.dataset.color,
    shape,
    finish: finish.value,
  };
}

function updatePreview() {
  const selected = styleSelection();

  document.documentElement.style.setProperty("--nail", selected.hex);

  const shapes = {
    Amendoado: "48% 48% 20% 20%",
    Quadrado: "8% 8% 18% 18%",
    Oval: "50% 50% 35% 35%",
  };

  document.documentElement.style.setProperty("--shape", shapes[selected.shape]);

  document.getElementById("selection").textContent =
    `${selected.color} · ${selected.shape} · ${selected.finish}`;
}

form.addEventListener("change", updatePreview);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const selected = styleSelection();

  const url = whatsappURL(
    `Olá, Caroll! Montei minha ideia no seu site: cor ${selected.color}, formato ${selected.shape} e acabamento ${selected.finish}. Gostaria de saber se é possível fazer essa combinação e consultar os valores e horários disponíveis.`,
  );

  window.open(url, "_blank", "noopener,noreferrer");
});

updatePreview();
