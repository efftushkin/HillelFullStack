# Dixit Worlds Slider

A responsive, accessible slider built with plain JavaScript and ES6 classes. All
slides, navigation controls, the autoplay button, and slide indicators are
generated dynamically by JavaScript.

## Features

- Previous and next navigation with seamless looping
- Configurable autoplay interval
- Manual autoplay pause and resume
- Automatic pause on hover, while dragging, and when the tab is hidden
- Clickable slide indicators and current slide counter
- Keyboard support: `ArrowLeft`, `ArrowRight`, `Home`, `End`, and `Space`
- Touch swipes and mouse dragging through Pointer Events
- Responsive layout and reduced-motion support
- Accessible labels, focus states, slide semantics, and live announcements

## Run

Open `index.html` in a modern browser. No build step or dependencies are
required. A local development server is recommended:

```bash
npx serve .
```

## Configuration

Edit the `sliderConfig` object at the bottom of `script.js`:

```js
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
```

The initialized instance is available as `window.dixitSlider` for testing in
the browser console.
