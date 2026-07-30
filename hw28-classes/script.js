class Slider {
  static defaultConfig = {
    autoplay: true,
    autoplayInterval: 5000,
    transitionDuration: 650,
    showIndicators: true,
    pauseOnHover: true,
    pauseWhenHidden: true,
    loop: true,
    swipeThreshold: 0.14,
  };

  constructor(selector, slides, options = {}) {
    this.root =
      typeof selector === "string" ? document.querySelector(selector) : selector;
    this.slidesData = slides;
    this.config = { ...Slider.defaultConfig, ...options };

    if (!this.root) {
      throw new Error("Slider root element was not found.");
    }

    if (!Array.isArray(slides) || slides.length === 0) {
      throw new Error("Slider requires at least one slide.");
    }

    this.currentIndex = 0;
    this.timerId = null;
    this.pauseReasons = new Set();
    this.pointerStartX = 0;
    this.pointerOffsetX = 0;
    this.activePointerId = null;
    this.isDragging = false;

    this.boundHandleKeydown = this.handleKeydown.bind(this);
    this.boundHandlePointerMove = this.handlePointerMove.bind(this);
    this.boundHandlePointerUp = this.handlePointerUp.bind(this);
    this.boundHandleVisibility = this.handleVisibilityChange.bind(this);

    this.render();
    this.cacheElements();
    this.bindEvents();
    this.update({ announce: false, restartAutoplay: false });

    if (this.config.autoplay) {
      this.startAutoplay();
    } else {
      this.pauseReasons.add("disabled");
      this.updateToggleButton();
    }
  }

  render() {
    this.root.className = "slider";
    this.root.tabIndex = 0;
    this.root.setAttribute("role", "region");
    this.root.setAttribute("aria-roledescription", "carousel");
    this.root.setAttribute("aria-label", "Dixit editions gallery");
    this.root.style.setProperty(
      "--transition-duration",
      `${this.config.transitionDuration}ms`,
    );
    this.root.style.setProperty(
      "--autoplay-interval",
      `${this.config.autoplayInterval}ms`,
    );

    const viewport = this.createElement("div", "slider__viewport");
    const track = this.createElement("div", "slider__track");
    track.id = "dixit-slider-track";

    this.slidesData.forEach((slide, index) => {
      track.append(this.createSlide(slide, index));
    });

    viewport.append(track);
    this.root.append(viewport, this.createToolbar(), this.createLiveRegion());
  }

  createSlide(slide, index) {
    const article = this.createElement("article", "slide");
    article.id = `dixit-slide-${index + 1}`;
    article.setAttribute("role", "group");
    article.setAttribute("aria-roledescription", "slide");
    article.setAttribute(
      "aria-label",
      `${index + 1} of ${this.slidesData.length}: ${slide.title}`,
    );
    article.style.setProperty("--slide-image", `url("${slide.image}")`);

    const ambient = this.createElement("div", "slide__ambient");
    ambient.setAttribute("aria-hidden", "true");

    const visual = this.createElement("div", "slide__visual");
    const imageWrap = this.createElement("div", "slide__image-wrap");
    const image = document.createElement("img");
    image.className = "slide__image";
    image.src = slide.image;
    image.alt = `${slide.title} board game box`;
    image.width = 600;
    image.height = 600;
    image.draggable = false;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    imageWrap.append(image);
    visual.append(imageWrap);

    const content = this.createElement("div", "slide__content");
    const edition = this.createElement("p", "slide__edition", slide.edition);
    const title = this.createElement("h2", "slide__title", slide.title);
    const description = this.createElement(
      "p",
      "slide__description",
      slide.description,
    );
    const tag = this.createElement("span", "slide__tag", slide.tag);
    content.append(edition, title, description, tag);

    article.append(ambient, visual, content);
    return article;
  }

  createToolbar() {
    const toolbar = this.createElement("div", "slider__toolbar");

    const count = this.createElement("div", "slider__count");
    count.setAttribute("aria-hidden", "true");
    count.innerHTML = `
      <span class="slider__count-current">01</span>
      <span class="slider__count-separator"> / </span>
      <span class="slider__count-total">${this.formatNumber(this.slidesData.length)}</span>
    `;

    const indicators = this.createElement("div", "slider__indicators");
    indicators.setAttribute("role", "group");
    indicators.setAttribute("aria-label", "Choose a slide");

    if (this.config.showIndicators) {
      this.slidesData.forEach((slide, index) => {
        const indicator = this.createElement("button", "slider__indicator");
        indicator.type = "button";
        indicator.dataset.slideIndex = index;
        indicator.setAttribute("aria-label", `Go to ${slide.title}`);
        indicator.setAttribute("aria-controls", `dixit-slide-${index + 1}`);
        indicators.append(indicator);
      });
    } else {
      indicators.hidden = true;
    }

    const actions = this.createElement("div", "slider__actions");
    const previousButton = this.createControlButton(
      "previous",
      "Previous slide",
      '<path d="m10 4-5 5 5 5"/><path d="M5 9h8"/>',
    );
    const toggleButton = this.createControlButton(
      "toggle",
      "Pause autoplay",
      '<path d="M5.5 4.5h2v9h-2zM10.5 4.5h2v9h-2z"/>',
    );
    const nextButton = this.createControlButton(
      "next",
      "Next slide",
      '<path d="m8 4 5 5-5 5"/><path d="M13 9H5"/>',
    );
    actions.append(previousButton, toggleButton, nextButton);

    const progress = this.createElement("div", "slider__progress");
    progress.setAttribute("aria-hidden", "true");
    progress.append(this.createElement("div", "slider__progress-bar"));

    toolbar.append(count, indicators, actions, progress);
    return toolbar;
  }

  createControlButton(action, label, icon) {
    const button = this.createElement(
      "button",
      `slider__button slider__button--${action}`,
    );
    button.type = "button";
    button.dataset.action = action;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-controls", "dixit-slider-track");
    button.innerHTML = `
      <svg viewBox="0 0 18 18" aria-hidden="true">${icon}</svg>
    `;
    return button;
  }

  createLiveRegion() {
    const status = this.createElement("p", "slider__status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    return status;
  }

  cacheElements() {
    this.viewport = this.root.querySelector(".slider__viewport");
    this.track = this.root.querySelector(".slider__track");
    this.slideElements = [...this.root.querySelectorAll(".slide")];
    this.indicators = [...this.root.querySelectorAll(".slider__indicator")];
    this.currentCount = this.root.querySelector(".slider__count-current");
    this.toggleButton = this.root.querySelector('[data-action="toggle"]');
    this.progressBar = this.root.querySelector(".slider__progress-bar");
    this.status = this.root.querySelector(".slider__status");
  }

  bindEvents() {
    this.root.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      const indicator = event.target.closest("[data-slide-index]");

      if (actionButton) {
        const actions = {
          previous: () => this.previous(),
          next: () => this.next(),
          toggle: () => this.toggleAutoplay(),
        };
        actions[actionButton.dataset.action]?.();
      }

      if (indicator) {
        this.goTo(Number(indicator.dataset.slideIndex));
      }
    });

    this.root.addEventListener("keydown", this.boundHandleKeydown);
    this.viewport.addEventListener(
      "pointerdown",
      this.handlePointerDown.bind(this),
    );
    this.viewport.addEventListener("pointermove", this.boundHandlePointerMove);
    this.viewport.addEventListener("pointerup", this.boundHandlePointerUp);
    this.viewport.addEventListener("pointercancel", this.boundHandlePointerUp);

    if (this.config.pauseOnHover) {
      this.root.addEventListener("mouseenter", () => this.pause("hover"));
      this.root.addEventListener("mouseleave", () => this.resume("hover"));
    }

    if (this.config.pauseWhenHidden) {
      document.addEventListener("visibilitychange", this.boundHandleVisibility);
    }
  }

  handleKeydown(event) {
    if (event.target.matches("button") && event.key === " ") {
      return;
    }

    const commands = {
      ArrowLeft: () => this.previous(),
      ArrowRight: () => this.next(),
      Home: () => this.goTo(0),
      End: () => this.goTo(this.slidesData.length - 1),
      " ": () => this.toggleAutoplay(),
    };

    if (commands[event.key]) {
      event.preventDefault();
      commands[event.key]();
    }
  }

  handlePointerDown(event) {
    if (event.button !== 0 || event.target.closest("button")) {
      return;
    }

    this.activePointerId = event.pointerId;
    this.pointerStartX = event.clientX;
    this.pointerOffsetX = 0;
    this.isDragging = true;
    this.root.classList.add("is-dragging");
    this.pause("drag");
    this.viewport.setPointerCapture(event.pointerId);
  }

  handlePointerMove(event) {
    if (!this.isDragging || event.pointerId !== this.activePointerId) {
      return;
    }

    this.pointerOffsetX = event.clientX - this.pointerStartX;
    const viewportWidth = this.viewport.clientWidth;

    if (
      !this.config.loop &&
      ((this.currentIndex === 0 && this.pointerOffsetX > 0) ||
        (this.currentIndex === this.slidesData.length - 1 &&
          this.pointerOffsetX < 0))
    ) {
      this.pointerOffsetX *= 0.28;
    }

    const offset = -this.currentIndex * viewportWidth + this.pointerOffsetX;
    this.track.style.transform = `translate3d(${offset}px, 0, 0)`;
  }

  handlePointerUp(event) {
    if (!this.isDragging || event.pointerId !== this.activePointerId) {
      return;
    }

    const threshold = Math.min(
      100,
      this.viewport.clientWidth * this.config.swipeThreshold,
    );
    const movedEnough = Math.abs(this.pointerOffsetX) >= threshold;
    const direction = this.pointerOffsetX < 0 ? 1 : -1;

    this.isDragging = false;
    this.activePointerId = null;
    this.root.classList.remove("is-dragging");

    if (movedEnough) {
      this.goTo(this.currentIndex + direction);
    } else {
      this.update();
    }

    this.resume("drag");
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pause("hidden");
    } else {
      this.resume("hidden");
    }
  }

  goTo(index, options = {}) {
    const lastIndex = this.slidesData.length - 1;

    if (this.config.loop) {
      this.currentIndex =
        ((index % this.slidesData.length) + this.slidesData.length) %
        this.slidesData.length;
    } else {
      this.currentIndex = Math.max(0, Math.min(index, lastIndex));
    }

    this.update(options);
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  previous() {
    this.goTo(this.currentIndex - 1);
  }

  update({ announce = true, restartAutoplay = true } = {}) {
    this.track.style.transform = `translate3d(-${this.currentIndex * 100}%, 0, 0)`;
    this.currentCount.textContent = this.formatNumber(this.currentIndex + 1);

    this.slideElements.forEach((slide, index) => {
      const isActive = index === this.currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    this.indicators.forEach((indicator, index) => {
      const isActive = index === this.currentIndex;
      indicator.classList.toggle("is-active", isActive);
      indicator.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (announce) {
      const currentSlide = this.slidesData[this.currentIndex];
      this.status.textContent = `Slide ${this.currentIndex + 1} of ${
        this.slidesData.length
      }: ${currentSlide.title}`;
    }

    if (restartAutoplay && this.config.autoplay) {
      this.restartAutoplay();
    }
  }

  startAutoplay() {
    if (
      !this.config.autoplay ||
      this.pauseReasons.size > 0 ||
      this.slidesData.length < 2
    ) {
      return;
    }

    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => {
      this.next();
    }, this.config.autoplayInterval);
    this.restartProgress();
  }

  stopAutoplay() {
    window.clearTimeout(this.timerId);
    this.timerId = null;
    this.progressBar.classList.remove("is-running");
  }

  restartAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  toggleAutoplay() {
    if (
      !this.config.autoplay ||
      this.pauseReasons.has("disabled")
    ) {
      this.config.autoplay = true;
      this.resume("disabled");
      this.status.textContent = "Autoplay started.";
      this.updateToggleButton();
      return;
    }

    if (this.pauseReasons.has("user")) {
      this.resume("user");
      this.status.textContent = "Autoplay resumed.";
    } else {
      this.pause("user");
      this.status.textContent = "Autoplay paused.";
    }

    this.updateToggleButton();
  }

  pause(reason = "user") {
    this.pauseReasons.add(reason);
    this.stopAutoplay();
    this.updateToggleButton();
  }

  resume(reason = "user") {
    this.pauseReasons.delete(reason);
    this.startAutoplay();
    this.updateToggleButton();
  }

  updateToggleButton() {
    const isUserPaused =
      this.pauseReasons.has("user") || this.pauseReasons.has("disabled");
    const label = isUserPaused ? "Resume autoplay" : "Pause autoplay";
    const icon = isUserPaused
      ? '<path d="m5.5 3.8 8 5.2-8 5.2z"/>'
      : '<path d="M5.5 4.5h2v9h-2zM10.5 4.5h2v9h-2z"/>';

    this.toggleButton.setAttribute("aria-label", label);
    this.toggleButton.setAttribute("aria-pressed", String(isUserPaused));
    this.toggleButton.querySelector("svg").innerHTML = icon;
  }

  restartProgress() {
    this.progressBar.classList.remove("is-running");
    void this.progressBar.offsetWidth;
    this.progressBar.classList.add("is-running");
  }

  createElement(tag, className, text = "") {
    const element = document.createElement(tag);
    element.className = className;

    if (text) {
      element.textContent = text;
    }

    return element;
  }

  formatNumber(number) {
    return String(number).padStart(2, "0");
  }

  destroy() {
    this.stopAutoplay();
    this.root.removeEventListener("keydown", this.boundHandleKeydown);
    document.removeEventListener("visibilitychange", this.boundHandleVisibility);
    this.root.replaceChildren();
    this.root.removeAttribute("class");
    this.root.removeAttribute("role");
    this.root.removeAttribute("aria-roledescription");
    this.root.removeAttribute("aria-label");
    this.root.removeAttribute("tabindex");
  }
}

const dixitSlides = [
  {
    title: "Dixit",
    edition: "The original · 2008",
    description:
      "The award-winning storytelling game where dreamlike illustrations inspire clues, guesses, and wonderfully unexpected connections.",
    tag: "The classic",
    image: "img/001-dixit.jpg",
  },
  {
    title: "Dixit Kids",
    edition: "Family edition",
    description:
      "A playful invitation for younger storytellers to explore emotions, imagination, and visual clues together.",
    tag: "For young dreamers",
    image: "img/002-dixit-kids.jpg",
  },
  {
    title: "Disney",
    edition: "Special edition",
    description:
      "Familiar Disney and Pixar worlds are reimagined through Dixit's poetic lens in a celebration of timeless stories.",
    tag: "A magical crossover",
    image: "img/003-dixit-disney.jpg",
  },
  {
    title: "Odyssey",
    edition: "Standalone · expansion",
    description:
      "A sweeping new voyage with enchanting cards, expanded play, and room for even more storytellers around the table.",
    tag: "A wider adventure",
    image: "img/004-dixit-odyssey.jpg",
  },
  {
    title: "Quest",
    edition: "Expansion · 2010",
    description:
      "Surreal paths and curious encounters turn every card into the beginning of a mysterious new quest.",
    tag: "84 illustrated cards",
    image: "img/102-dixit-quest.jpg",
  },
  {
    title: "Journey",
    edition: "Expansion · 2012",
    description:
      "Travel beyond the familiar through gentle, strange, and beautifully open-ended illustrated worlds.",
    tag: "84 illustrated cards",
    image: "img/103-dixit-journey.jpg",
  },
  {
    title: "Origins",
    edition: "Expansion · 2013",
    description:
      "Return to the roots of myth and imagination with vivid scenes that feel ancient, playful, and entirely new.",
    tag: "84 illustrated cards",
    image: "img/104-dixit-origins.jpg",
  },
  {
    title: "Daydreams",
    edition: "Expansion · 2014",
    description:
      "Drift into luminous daydreams where quiet details and impossible landscapes reward a closer look.",
    tag: "84 illustrated cards",
    image: "img/105-dixit-daydreams.jpg",
  },
  {
    title: "Memories",
    edition: "Expansion · 2015",
    description:
      "Fragments of wonder, nostalgia, and fantasy blur together in images that invite deeply personal stories.",
    tag: "84 illustrated cards",
    image: "img/106-dixit-memories.jpg",
  },
  {
    title: "Revelations",
    edition: "Expansion · 2016",
    description:
      "Elegant symbolism and richly layered scenes reveal something different to every storyteller.",
    tag: "84 illustrated cards",
    image: "img/107-dixit-relevations.jpg",
  },
  {
    title: "Harmonies",
    edition: "Expansion · 2017",
    description:
      "Nature, music, and human imagination move in harmony across a collection of intricate visual poetry.",
    tag: "84 illustrated cards",
    image: "img/108-dixit-harmonies.jpg",
  },
  {
    title: "Anniversary",
    edition: "Celebration edition · 2018",
    description:
      "Dixit artists reunite for a celebratory collection filled with affectionate echoes and fresh surprises.",
    tag: "10 years of stories",
    image: "img/109-dixit-anniversary.jpg",
  },
  {
    title: "Mirrors",
    edition: "Expansion · 2020",
    description:
      "Colorful reflections transform everyday moments into whimsical scenes full of movement and possibility.",
    tag: "84 illustrated cards",
    image: "img/110-dixit-mirrors.jpg",
  },
];

const sliderConfig = {
  autoplay: true,
  autoplayInterval: 5000,
  transitionDuration: 650,
  showIndicators: true,
  pauseOnHover: true,
  pauseWhenHidden: true,
  loop: true,
  swipeThreshold: 0.14,
};

window.dixitSlider = new Slider("#dixit-slider", dixitSlides, sliderConfig);
