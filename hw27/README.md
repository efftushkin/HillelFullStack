# Whisker Stories

A responsive, accessible image slider built with HTML, CSS, and pure JavaScript.
The implementation uses a functional approach: small focused functions manage
rendering, navigation, autoplay, drag gestures, and UI updates.

## Features

- Previous and next navigation with infinite wrapping
- Five-second autoplay interval
- Pause and resume control
- Clickable slide indicators
- Left and right arrow keyboard navigation
- Touch swipe and mouse drag navigation using Pointer Events
- Responsive layout for desktop, tablet, and mobile screens
- Reduced-motion preference support
- Semantic carousel labels and keyboard-visible focus states

## Run locally

No build step or dependencies are required. Open `index.html` in a browser, or
serve the directory with any static file server.

For example, with VS Code you can use the Live Server extension.

## Project structure

```text
.
├── img/          # Local gallery artwork
├── index.html    # Page structure
├── style.css     # Responsive design and animations
└── script.js     # Slider data, state, and behavior
```

## Image credits

The illustrations used in this project were created by **mj.majcha**.

[MJ.Majcha on Instagram](https://www.instagram.com/mj.majcha/)

## Controls

- Select the arrow buttons to move backward or forward.
- Select an indicator to jump directly to a slide.
- Select **Pause** or **Play** to control autoplay.
- Press `←` or `→` anywhere on the page to navigate.
- Swipe on touchscreens or drag with the mouse on desktop.
