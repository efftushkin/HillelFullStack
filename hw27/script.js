const AUTOPLAY_DELAY = 5000;
const SWIPE_THRESHOLD = 55;

const slides = [
  {
    image: "img/001 Sleepy Strawberry Cat.jpg",
    title: "Sleepy Strawberry Cat",
    description:
      "A quiet afternoon tucked between strawberry leaves and tiny white blooms.",
  },
  {
    image: "img/002 Cat-s Window.jpg",
    title: "Cat's Window",
    description:
      "Soft daylight, a warm sill, and an unhurried view of the world outside.",
  },
  {
    image: "img/003 Rainy Day.jpg",
    title: "Rainy Day",
    description:
      "A gentle shower turns an ordinary walk into a small, puddle-filled adventure.",
  },
  {
    image: "img/004 Bath Time Kitty.jpg",
    title: "Bath Time Kitty",
    description:
      "Bubbles gather and worries disappear during the coziest part of the evening.",
  },
  {
    image: "img/005 Sleepy Cat With Blanket.jpg",
    title: "Blanket Weather",
    description:
      "Wrapped in a favorite blanket, this sleepy friend has nowhere else to be.",
  },
  {
    image: "img/006 Snow Angel.jpg",
    title: "Snow Angel",
    description:
      "Fresh snow invites tiny paws to make a little winter magic of their own.",
  },
  {
    image: "img/007 Clovers Cat.jpg",
    title: "Among the Clovers",
    description:
      "A lucky patch of green makes the perfect place for an afternoon daydream.",
  },
  {
    image: "img/008 Teddy-s Cat.jpg",
    title: "Teddy's Cat",
    description:
      "The best kind of friendship is soft, loyal, and always ready for a cuddle.",
  },
  {
    image: "img/009 Mocha Kitty.jpg",
    title: "Mocha Kitty",
    description:
      "One warm cup, one curious kitten, and a morning moving at exactly the right pace.",
  },
  {
    image: "img/010 Chef Cat.jpg",
    title: "Chef Cat",
    description:
      "A tiny kitchen expert prepares something wonderful with confidence and care.",
  },
  {
    image: "img/011 Sleepy Flowers Kitten.jpg",
    title: "Flower Bed",
    description:
      "Petals become pillows when a peaceful kitten finds the sweetest place to rest.",
  },
  {
    image: "img/012 Bread Cat.jpg",
    title: "Freshly Baked",
    description:
      "Warm bread and warm paws make an unexpectedly perfect pair.",
  },
  {
    image: "img/013 Sleepy Chubby Cat.jpg",
    title: "The Longest Nap",
    description:
      "No plans, no alarms—only a soft spot and all the time in the world.",
  },
  {
    image: "img/014 Garden Cat And Flower Duck.jpg",
    title: "Garden Friends",
    description:
      "Two unlikely gardeners stop to admire what has bloomed between them.",
  },
  {
    image: "img/015 Hot Chocolate Kitty.jpg",
    title: "Hot Chocolate",
    description:
      "A generous swirl of cream makes a cold afternoon feel especially kind.",
  },
  {
    image: "img/016 Best Friend.jpg",
    title: "Best Friend",
    description:
      "Some friendships need no explanation—just a shared moment and a little closeness.",
  },
  {
    image: "img/017 Decorating Cookies.jpg",
    title: "Cookie Day",
    description:
      "Sprinkles everywhere and not a single perfectly decorated cookie in sight.",
  },
  {
    image: "img/018 Cat-s Tea Cup.jpg",
    title: "Tea Cup Cat",
    description:
      "A floral cup turns out to be just the right size for an unexpected guest.",
  },
  {
    image: "img/019 Elf-s Work Day.jpg",
    title: "Elf's Work Day",
    description:
      "Holiday preparations are serious business for the workshop's smallest helper.",
  },
  {
    image: "img/020 Lazy Monday.jpg",
    title: "Lazy Monday",
    description:
      "The week can wait a moment longer while the pillows are still this comfortable.",
  },
];

const slider = document.querySelector(".slider");
const viewport = slider.querySelector(".slider__viewport");
const track = slider.querySelector(".slider__track");
const previousButton = slider.querySelector(".slider__arrow--previous");
const nextButton = slider.querySelector(".slider__arrow--next");
const playButton = slider.querySelector(".play-button");
const playButtonLabel = slider.querySelector(".play-button__label");
const dotsContainer = slider.querySelector(".slider__dots");
const currentCounter = slider.querySelector(".slide-count__current");
const totalCounter = slider.querySelector(".slide-count__total");
const copy = slider.querySelector(".slide-copy");
const storyNumber = slider.querySelector(".slide-copy__number");
const title = slider.querySelector(".slide-copy__title");
const description = slider.querySelector(".slide-copy__description");
const progressBar = slider.querySelector(".slider__progress-bar");

const state = {
  currentIndex: 0,
  isPlaying: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  autoplayTimer: null,
  dragStartX: 0,
  dragDistance: 0,
  isDragging: false,
};

const formatNumber = (number) => String(number).padStart(2, "0");

const wrapIndex = (index) => (index + slides.length) % slides.length;

const createSlide = ({ image, title: slideTitle }, index) => {
  const article = document.createElement("article");
  const imageElement = document.createElement("img");

  article.className = "slide";
  article.setAttribute("role", "group");
  article.setAttribute("aria-roledescription", "slide");
  article.setAttribute("aria-label", `${index + 1} of ${slides.length}`);

  imageElement.className = "slide__image";
  imageElement.src = image;
  imageElement.alt = slideTitle;
  imageElement.draggable = false;
  imageElement.loading = index < 2 ? "eager" : "lazy";

  article.append(imageElement);
  return article;
};

const createDot = (_, index) => {
  const dot = document.createElement("button");

  dot.className = "slider__dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
  dot.dataset.index = index;
  return dot;
};

const renderInitialContent = () => {
  const slideFragment = document.createDocumentFragment();
  const dotFragment = document.createDocumentFragment();

  slides.forEach((slide, index) => {
    slideFragment.append(createSlide(slide, index));
    dotFragment.append(createDot(slide, index));
  });

  track.append(slideFragment);
  dotsContainer.append(dotFragment);
  totalCounter.textContent = formatNumber(slides.length);
};

const updateCopy = () => {
  const activeSlide = slides[state.currentIndex];

  storyNumber.textContent = `Story ${formatNumber(state.currentIndex + 1)}`;
  title.textContent = activeSlide.title;
  description.textContent = activeSlide.description;
  currentCounter.textContent = formatNumber(state.currentIndex + 1);

  copy.classList.remove("is-changing");
  requestAnimationFrame(() => copy.classList.add("is-changing"));
};

const updateDots = () => {
  const dots = dotsContainer.querySelectorAll(".slider__dot");

  dots.forEach((dot, index) => {
    const isActive = index === state.currentIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
    dot.tabIndex = isActive ? 0 : -1;
  });

  dots[state.currentIndex]?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
};

const updateTrack = (animate = true, dragOffset = 0) => {
  track.classList.toggle("is-animating", animate);
  const offset = -state.currentIndex * viewport.clientWidth + dragOffset;
  track.style.transform = `translate3d(${offset}px, 0, 0)`;
};

const restartProgress = () => {
  progressBar.classList.remove("is-running");
  progressBar.style.setProperty("--autoplay-duration", `${AUTOPLAY_DELAY}ms`);
  void progressBar.offsetWidth;
  progressBar.classList.toggle("is-running", state.isPlaying);
};

const stopAutoplayTimer = () => {
  window.clearInterval(state.autoplayTimer);
  state.autoplayTimer = null;
};

const startAutoplayTimer = () => {
  stopAutoplayTimer();

  if (!state.isPlaying) return;

  state.autoplayTimer = window.setInterval(() => {
    goToSlide(state.currentIndex + 1);
  }, AUTOPLAY_DELAY);
};

const resetAutoplay = () => {
  startAutoplayTimer();
  restartProgress();
};

function goToSlide(index, { resetTimer = true } = {}) {
  state.currentIndex = wrapIndex(index);
  updateTrack();
  updateCopy();
  updateDots();

  if (resetTimer) resetAutoplay();
}

const toggleAutoplay = () => {
  state.isPlaying = !state.isPlaying;
  playButton.classList.toggle("is-paused", !state.isPlaying);
  playButtonLabel.textContent = state.isPlaying ? "Pause" : "Play";
  playButton.setAttribute(
    "aria-label",
    state.isPlaying ? "Pause autoplay" : "Resume autoplay",
  );
  resetAutoplay();
};

const beginDrag = (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (event.target.closest("button, a")) return;

  state.isDragging = true;
  state.dragStartX = event.clientX;
  state.dragDistance = 0;
  viewport.classList.add("is-dragging");
  track.classList.remove("is-animating");
  viewport.setPointerCapture(event.pointerId);
  stopAutoplayTimer();
  progressBar.classList.remove("is-running");
};

const moveDrag = (event) => {
  if (!state.isDragging) return;

  state.dragDistance = event.clientX - state.dragStartX;
  updateTrack(false, state.dragDistance);
};

const endDrag = (event) => {
  if (!state.isDragging) return;

  state.isDragging = false;
  viewport.classList.remove("is-dragging");

  if (viewport.hasPointerCapture(event.pointerId)) {
    viewport.releasePointerCapture(event.pointerId);
  }

  if (Math.abs(state.dragDistance) >= SWIPE_THRESHOLD) {
    goToSlide(state.currentIndex + (state.dragDistance < 0 ? 1 : -1));
  } else {
    updateTrack();
    resetAutoplay();
  }

  state.dragDistance = 0;
};

const handleKeyboard = (event) => {
  const tagName = document.activeElement?.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA") return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToSlide(state.currentIndex - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    goToSlide(state.currentIndex + 1);
  }
};

const bindEvents = () => {
  previousButton.addEventListener("click", () =>
    goToSlide(state.currentIndex - 1),
  );
  nextButton.addEventListener("click", () =>
    goToSlide(state.currentIndex + 1),
  );
  playButton.addEventListener("click", toggleAutoplay);

  dotsContainer.addEventListener("click", (event) => {
    const dot = event.target.closest(".slider__dot");
    if (!dot) return;
    goToSlide(Number(dot.dataset.index));
  });

  viewport.addEventListener("pointerdown", beginDrag);
  viewport.addEventListener("pointermove", moveDrag);
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  window.addEventListener("keydown", handleKeyboard);
  window.addEventListener("resize", () => updateTrack(false));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplayTimer();
      progressBar.classList.remove("is-running");
    } else {
      resetAutoplay();
    }
  });
};

const initializeSlider = () => {
  renderInitialContent();
  bindEvents();
  updateTrack(false);
  updateCopy();
  updateDots();

  if (!state.isPlaying) {
    playButton.classList.add("is-paused");
    playButtonLabel.textContent = "Play";
    playButton.setAttribute("aria-label", "Resume autoplay");
  }

  resetAutoplay();
};

initializeSlider();
