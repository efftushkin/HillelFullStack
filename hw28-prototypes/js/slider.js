(function () {
  "use strict";

  var DEFAULTS = {
    autoplay: true,
    autoplayInterval: 4000,
    showIndicators: true,
    showNavigation: true,
    pauseOnHover: true,
    keyboard: true,
    swipeThreshold: 50,
  };

  var ICONS = {
    previous:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    next:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pause:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    play:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6V6Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  /**
   * Base slider constructor.
   * @param {HTMLElement|string} target Slider element or CSS selector.
   * @param {Array<Object>} slides Slide data.
   * @param {Object} options Custom configuration.
   */
  function Slider(target, slides, options) {
    this.root =
      typeof target === "string" ? document.querySelector(target) : target;

    if (!this.root) {
      throw new Error("Slider root element was not found.");
    }

    if (!Array.isArray(slides) || slides.length === 0) {
      throw new Error("Slider requires at least one slide.");
    }

    this.slidesData = slides;
    this.options = Object.assign({}, DEFAULTS, options);
    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.isUserPaused = !this.options.autoplay;
    this.isHoverPaused = false;
    this.isPageHidden = document.hidden;

    this.init();
  }

  Slider.prototype.init = function () {
    this.createSlider();
    this.cacheElements();
    this.bindEvents();
    this.updateSlider(false);
    this.syncAutoplay();
  };

  Slider.prototype.createSlider = function () {
    var fragment = document.createDocumentFragment();
    var viewport = this.createElement("div", "slider__viewport");
    var track = this.createElement("div", "slider__track");

    this.root.classList.add("slider");
    this.root.setAttribute("role", "region");
    this.root.setAttribute("aria-roledescription", "carousel");
    this.root.setAttribute("aria-label", "Dixit game collection");
    this.root.setAttribute("tabindex", "0");

    this.slidesData.forEach(
      function (slide, index) {
        track.appendChild(this.createSlide(slide, index));
      }.bind(this),
    );

    viewport.appendChild(track);
    fragment.appendChild(viewport);

    if (this.options.showIndicators && this.slidesData.length > 1) {
      fragment.appendChild(this.createIndicators());
    }

    if (this.options.showNavigation && this.slidesData.length > 1) {
      fragment.appendChild(this.createControls());
    }

    var status = this.createElement("p", "slider__status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
    fragment.appendChild(status);

    this.root.replaceChildren(fragment);
  };

  Slider.prototype.createElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    element.className = className;

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  };

  Slider.prototype.createSlide = function (slide, index) {
    var article = this.createElement("article", "slider__slide");
    var imageWrap = this.createElement("div", "slider__image-wrap");
    var image = this.createElement("img", "slider__image");
    var content = this.createElement("div", "slider__content");
    var number = this.createElement(
      "span",
      "slider__number",
      "Collection " + String(index + 1).padStart(2, "0"),
    );
    var title = this.createElement("h3", "slider__title", slide.title);
    var description = this.createElement(
      "p",
      "slider__description",
      slide.description,
    );

    article.id = "slide-" + (index + 1);
    article.setAttribute("role", "group");
    article.setAttribute("aria-roledescription", "slide");
    article.setAttribute(
      "aria-label",
      index + 1 + " of " + this.slidesData.length,
    );
    article.style.setProperty("--slide-image", 'url("' + slide.image + '")');

    image.src = slide.image;
    image.alt = slide.alt || slide.title;
    image.draggable = false;
    image.loading = index === 0 ? "eager" : "lazy";
    imageWrap.appendChild(image);

    content.appendChild(number);
    content.appendChild(title);
    content.appendChild(description);
    article.appendChild(imageWrap);
    article.appendChild(content);

    return article;
  };

  Slider.prototype.createControls = function () {
    var controls = this.createElement("div", "slider__controls");
    var previous = this.createButton(
      "slider__button slider__button--previous",
      "Previous slide",
      ICONS.previous,
    );
    var autoplay = this.createButton(
      "slider__button slider__button--autoplay",
      this.isUserPaused ? "Start autoplay" : "Pause autoplay",
      this.isUserPaused ? ICONS.play : ICONS.pause,
    );
    var next = this.createButton(
      "slider__button slider__button--next",
      "Next slide",
      ICONS.next,
    );

    autoplay.setAttribute("aria-pressed", String(this.isUserPaused));

    controls.appendChild(previous);
    controls.appendChild(autoplay);
    controls.appendChild(next);

    return controls;
  };

  Slider.prototype.createButton = function (className, label, icon) {
    var button = this.createElement("button", className);
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.innerHTML = icon;
    return button;
  };

  Slider.prototype.createIndicators = function () {
    var indicators = this.createElement("div", "slider__indicators");
    indicators.setAttribute("role", "group");
    indicators.setAttribute("aria-label", "Choose a slide");

    this.slidesData.forEach(
      function (slide, index) {
        var indicator = this.createElement(
          "button",
          "slider__indicator",
        );
        indicator.type = "button";
        indicator.dataset.slide = index;
        indicator.setAttribute("aria-label", "Go to " + slide.title);
        indicator.setAttribute("aria-controls", "slide-" + (index + 1));
        indicators.appendChild(indicator);
      }.bind(this),
    );

    return indicators;
  };

  Slider.prototype.cacheElements = function () {
    this.viewport = this.root.querySelector(".slider__viewport");
    this.track = this.root.querySelector(".slider__track");
    this.slides = Array.from(this.root.querySelectorAll(".slider__slide"));
    this.indicators = Array.from(
      this.root.querySelectorAll(".slider__indicator"),
    );
    this.previousButton = this.root.querySelector(
      ".slider__button--previous",
    );
    this.nextButton = this.root.querySelector(".slider__button--next");
    this.autoplayButton = this.root.querySelector(
      ".slider__button--autoplay",
    );
    this.status = this.root.querySelector(".slider__status");
  };

  Slider.prototype.bindEvents = function () {
    if (this.previousButton) {
      this.previousButton.addEventListener("click", this.previous.bind(this));
      this.nextButton.addEventListener("click", this.next.bind(this));
      this.autoplayButton.addEventListener(
        "click",
        this.toggleAutoplay.bind(this),
      );
    }

    this.indicators.forEach(
      function (indicator) {
        indicator.addEventListener(
          "click",
          function () {
            this.goTo(Number(indicator.dataset.slide));
          }.bind(this),
        );
      }.bind(this),
    );

    if (this.options.keyboard) {
      this.root.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    if (this.options.pauseOnHover) {
      this.root.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
      this.root.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    }

    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange.bind(this),
    );
  };

  Slider.prototype.previous = function () {
    this.goTo(this.currentIndex - 1);
  };

  Slider.prototype.next = function () {
    this.goTo(this.currentIndex + 1);
  };

  Slider.prototype.goTo = function (index) {
    var slideCount = this.slidesData.length;
    this.currentIndex = ((index % slideCount) + slideCount) % slideCount;
    this.updateSlider(true);
    this.restartAutoplay();
  };

  Slider.prototype.updateSlider = function (announce) {
    this.track.style.transform =
      "translate3d(-" + this.currentIndex * 100 + "%, 0, 0)";

    this.slides.forEach(
      function (slide, index) {
        var isCurrent = index === this.currentIndex;
        slide.setAttribute("aria-hidden", String(!isCurrent));
        slide.inert = !isCurrent;
      }.bind(this),
    );

    this.indicators.forEach(
      function (indicator, index) {
        if (index === this.currentIndex) {
          indicator.setAttribute("aria-current", "true");
        } else {
          indicator.removeAttribute("aria-current");
        }
      }.bind(this),
    );

    if (announce) {
      this.status.textContent =
        this.slidesData[this.currentIndex].title +
        ", slide " +
        (this.currentIndex + 1) +
        " of " +
        this.slidesData.length;
    }
  };

  Slider.prototype.startAutoplay = function () {
    if (
      this.isUserPaused ||
      this.isHoverPaused ||
      this.isPageHidden ||
      this.slidesData.length < 2
    ) {
      return;
    }

    this.stopAutoplay();
    this.autoplayTimer = window.setInterval(
      this.next.bind(this),
      this.options.autoplayInterval,
    );
  };

  Slider.prototype.stopAutoplay = function () {
    if (this.autoplayTimer !== null) {
      window.clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  };

  Slider.prototype.restartAutoplay = function () {
    this.stopAutoplay();
    this.startAutoplay();
  };

  Slider.prototype.syncAutoplay = function () {
    if (this.isUserPaused || this.isHoverPaused || this.isPageHidden) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  };

  Slider.prototype.toggleAutoplay = function () {
    this.isUserPaused = !this.isUserPaused;
    this.updateAutoplayButton();
    this.syncAutoplay();
  };

  Slider.prototype.updateAutoplayButton = function () {
    if (!this.autoplayButton) {
      return;
    }

    this.autoplayButton.innerHTML = this.isUserPaused
      ? ICONS.play
      : ICONS.pause;
    this.autoplayButton.setAttribute(
      "aria-label",
      this.isUserPaused ? "Start autoplay" : "Pause autoplay",
    );
    this.autoplayButton.setAttribute(
      "aria-pressed",
      String(this.isUserPaused),
    );
  };

  Slider.prototype.handleKeydown = function (event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.previous();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this.next();
    } else if (event.key === " " && event.target === this.root) {
      event.preventDefault();
      this.toggleAutoplay();
    }
  };

  Slider.prototype.handleMouseEnter = function () {
    this.isHoverPaused = true;
    this.syncAutoplay();
  };

  Slider.prototype.handleMouseLeave = function () {
    this.isHoverPaused = false;
    this.syncAutoplay();
  };

  Slider.prototype.handleVisibilityChange = function () {
    this.isPageHidden = document.hidden;
    this.syncAutoplay();
  };

  /**
   * Slider extension that inherits base behavior and adds pointer dragging.
   */
  function DraggableSlider(target, slides, options) {
    this.dragStartX = 0;
    this.dragOffsetX = 0;
    this.isDragging = false;
    this.pointerId = null;

    Slider.call(this, target, slides, options);
  }

  DraggableSlider.prototype = Object.create(Slider.prototype);
  DraggableSlider.prototype.constructor = DraggableSlider;

  DraggableSlider.prototype.bindEvents = function () {
    Slider.prototype.bindEvents.call(this);

    this.viewport.addEventListener(
      "pointerdown",
      this.handlePointerDown.bind(this),
    );
    this.viewport.addEventListener(
      "pointermove",
      this.handlePointerMove.bind(this),
    );
    this.viewport.addEventListener(
      "pointerup",
      this.handlePointerUp.bind(this),
    );
    this.viewport.addEventListener(
      "pointercancel",
      this.handlePointerUp.bind(this),
    );
    this.viewport.addEventListener("dragstart", function (event) {
      event.preventDefault();
    });
  };

  DraggableSlider.prototype.handlePointerDown = function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    this.isDragging = true;
    this.pointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragOffsetX = 0;
    this.root.classList.add("slider--dragging");
    this.viewport.setPointerCapture(event.pointerId);
    this.stopAutoplay();
  };

  DraggableSlider.prototype.handlePointerMove = function (event) {
    if (!this.isDragging || event.pointerId !== this.pointerId) {
      return;
    }

    this.dragOffsetX = event.clientX - this.dragStartX;
    var offsetPercent =
      (this.dragOffsetX / this.viewport.getBoundingClientRect().width) * 100;
    var position = this.currentIndex * -100 + offsetPercent;
    this.track.style.transform =
      "translate3d(" + position + "%, 0, 0)";
  };

  DraggableSlider.prototype.handlePointerUp = function (event) {
    if (!this.isDragging || event.pointerId !== this.pointerId) {
      return;
    }

    this.isDragging = false;
    this.root.classList.remove("slider--dragging");

    if (this.viewport.hasPointerCapture(event.pointerId)) {
      this.viewport.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(this.dragOffsetX) >= this.options.swipeThreshold) {
      this.dragOffsetX < 0 ? this.next() : this.previous();
    } else {
      this.updateSlider(false);
      this.restartAutoplay();
    }

    this.pointerId = null;
    this.dragOffsetX = 0;
  };

  window.Slider = Slider;
  window.DraggableSlider = DraggableSlider;
})();
