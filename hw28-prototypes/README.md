# Prototype-based JavaScript Slider

A responsive, accessible image slider built with vanilla JavaScript constructor
functions, prototypes, and prototype inheritance. No JavaScript classes or
third-party slider libraries are used.

## Features

- Previous and next navigation with continuous wrapping
- Configurable autoplay interval
- Pause and resume control
- Automatic pause on hover and while the browser tab is hidden
- Clickable slide indicators
- Left and right arrow keyboard navigation
- Mouse dragging and touch swiping via Pointer Events
- Controls and indicators generated dynamically in JavaScript
- Responsive layout and reduced-motion support
- Accessible labels, live slide announcements, and focus styles

## Architecture

`Slider` is the base constructor. Its prototype contains slide navigation,
autoplay, keyboard handling, dynamic DOM creation, and UI updates.

`DraggableSlider` calls the base constructor and inherits from
`Slider.prototype`:

```js
DraggableSlider.prototype = Object.create(Slider.prototype);
DraggableSlider.prototype.constructor = DraggableSlider;
```

It overrides `bindEvents` while still calling the base implementation, then
adds pointer event handling for both touch and mouse input.

## Configuration

Create a slider by passing a selector, slide data, and an options object:

```js
new DraggableSlider("#dixit-slider", slides, {
  autoplay: true,
  autoplayInterval: 4500,
  showIndicators: true,
  showNavigation: true,
  pauseOnHover: true,
  keyboard: true,
  swipeThreshold: 55,
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `autoplay` | Boolean | `true` | Enables automatic slide changes |
| `autoplayInterval` | Number | `4000` | Time between slides in milliseconds |
| `showIndicators` | Boolean | `true` | Shows clickable position indicators |
| `showNavigation` | Boolean | `true` | Shows previous, pause/play, and next buttons |
| `pauseOnHover` | Boolean | `true` | Temporarily pauses autoplay on hover |
| `keyboard` | Boolean | `true` | Enables left/right arrow navigation |
| `swipeThreshold` | Number | `50` | Required drag distance in pixels |

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static
development server.
