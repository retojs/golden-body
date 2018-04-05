let goldenContext = (function () {

  let gc = {
    size: 4 * 120,
    origin: [4 * 447, 4 * 470],
  };

  gc.canvas = document.getElementById('golden-body-canvas');
  gc.ctx = gc.canvas.getContext('2d');
  gc.pentaStyle = new PentaStyles(gc.ctx);

  gc.setup = function () {
    this.painter = new PentaPainter();
    this.goldenBody = new GoldenBody(this.origin, this.size, PM.deg90);
    this.painter.paintGoldenBody(this.goldenBody);
  }

  return gc;
})();

goldenContext.setup();

goldenContext.canvas.addEventListener("mouseenter", (event) => {
  goldenContext.mouseOverCanvas = true;
});

goldenContext.canvas.addEventListener("mouseleave", (event) => {
  goldenContext.mouseOverCanvas = false;
});

goldenContext.canvas.addEventListener("scroll", (event) => {
  console.log("scroll event on canvas element ", goldenContext.canvas.scrollTop);
});

let lastScrollY = 0;

document.addEventListener("scroll", (event) => {
  console.log("scrolling ", event);
  let gc = goldenContext;

  if (gc.mouseOverCanvas) {
    console.log("now we're talking", window.scrollY, lastScrollY);

    if (window.scrollY >= lastScrollY) {
      gc.zoom = 1 + window.scrollY / gc.canvas.height;
      lastScrollY = window.scrollY;
      console.log("greater ", gc.zoom, lastScrollY, window.scrollY);
      window.scrollTo(0, 0);
    }
  }


  event.preventDefault();
  event.stopPropagation();
});

let canvasImage = document.getElementById('canvas-image');
canvasImage.addEventListener("click", (event) => {
  let img = new Image;
  img.crossOrigin = "Anonymous";
  img.src = goldenContext.canvas.toDataURL("image/png");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
  canvasImage.src = image; // it will save locally
})