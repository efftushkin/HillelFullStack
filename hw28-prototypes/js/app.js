(function () {
  "use strict";

  var slides = [
    {
      title: "Dixit",
      image: "./img/001-dixit.jpg",
      alt: "Dixit board game box",
      description:
        "The original storytelling game where dreamlike illustrations spark clues, guesses, and surprising connections.",
    },
    {
      title: "Dixit Kids",
      image: "./img/002-dixit-kids.jpg",
      alt: "Dixit Kids board game box",
      description:
        "A welcoming version created for younger storytellers, full of imagination, discovery, and shared adventures.",
    },
    {
      title: "Dixit Disney",
      image: "./img/003-dixit-disney.jpg",
      alt: "Dixit Disney board game box",
      description:
        "Beloved Disney and Pixar worlds meet Dixit's poetic play in an enchanting collection of original artwork.",
    },
    {
      title: "Dixit Odyssey",
      image: "./img/004-dixit-odyssey.jpg",
      alt: "Dixit Odyssey board game box",
      description:
        "A standalone journey with new artwork and room for larger groups to tell unforgettable stories together.",
    },
    {
      title: "Quest",
      image: "./img/102-dixit-quest.jpg",
      alt: "Dixit Quest expansion box",
      description:
        "Step into strange landscapes and curious encounters with an expansion built around mystery and exploration.",
    },
    {
      title: "Journey",
      image: "./img/103-dixit-journey.jpg",
      alt: "Dixit Journey expansion box",
      description:
        "Set out beyond the familiar through evocative images that invite every player to invent a new path.",
    },
    {
      title: "Origins",
      image: "./img/104-dixit-origins.jpg",
      alt: "Dixit Origins expansion box",
      description:
        "Return to the roots of myths, dreams, and memories through surreal scenes open to endless interpretation.",
    },
    {
      title: "Daydreams",
      image: "./img/105-dixit-daydreams.jpg",
      alt: "Dixit Daydreams expansion box",
      description:
        "Drift into playful visions where ordinary details transform into imaginative stories and clever clues.",
    },
    {
      title: "Memories",
      image: "./img/106-dixit-memories.jpg",
      alt: "Dixit Memories expansion box",
      description:
        "Rediscover half-remembered places and emotions in a collection of gentle, atmospheric illustrations.",
    },
    {
      title: "Revelations",
      image: "./img/107-dixit-relevations.jpg",
      alt: "Dixit Revelations expansion box",
      description:
        "Look closer at intricate scenes that reveal unexpected ideas, hidden meanings, and bold new tales.",
    },
    {
      title: "Harmonies",
      image: "./img/108-dixit-harmonies.jpg",
      alt: "Dixit Harmonies expansion box",
      description:
        "Nature, music, and imagination flow together in richly detailed artwork filled with visual echoes.",
    },
    {
      title: "10th Anniversary",
      image: "./img/109-dixit-anniversary.jpg",
      alt: "Dixit 10th Anniversary expansion box",
      description:
        "A celebratory collection in which Dixit artists revisit their worlds and share new creative connections.",
    },
    {
      title: "Mirrors",
      image: "./img/110-dixit-mirrors.jpg",
      alt: "Dixit Mirrors expansion box",
      description:
        "Bright colors and playful reflections open portals to lively stories seen from unexpected perspectives.",
    },
  ];

  var slider = new DraggableSlider("#dixit-slider", slides, {
    autoplay: true,
    autoplayInterval: 4500,
    showIndicators: true,
    showNavigation: true,
    pauseOnHover: true,
    keyboard: true,
    swipeThreshold: 55,
  });

  // Exposed for demonstration and debugging in the browser console.
  window.dixitSlider = slider;
})();
