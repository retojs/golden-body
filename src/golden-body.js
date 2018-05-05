let goldenContext = {
  size: 4 * 120,
  origin: [4 * 447, 4 * 470],
};

goldenContext.canvas = document.getElementById('golden-body-canvas');
goldenContext.ctx = goldenContext.canvas.getContext('2d');
goldenContext.pentaStyles = new PentaStyles();

goldenContext.setup = function () {
  this.painter = new PentaPainter();
  this.goldenBody = new GoldenBody(this.origin, this.size, PM.deg90);
  this.painter.paintGoldenBody(this.goldenBody);
}
goldenContext.setup();

/** 
goldenContext.canvas.addEventListener("mouseenter", (event) => {
  goldenContext.mouseOverCanvas = true;
});

goldenContext.canvas.addEventListener("mouseleave", (event) => {
  goldenContext.mouseOverCanvas = false;
});

goldenContext.canvas.addEventListener("scroll", (event) => {
  console.log("scroll event on canvas element ", goldenContext.canvas.scrollTop);
});
*/
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
  let gc = goldenContext;
  let canvas = document.createElement('canvas');
  canvas.width = 3600;
  canvas.height = 4016;

  gc.ctx = canvas.getContext('2d');
  gc.painter.paintGoldenBody(gc.goldenBody).then(() => {
    // copy canvas image data to canvas-image as data URL.
    canvasImage.src = canvas.toDataURL("image/png");
    gc.ctx = gc.canvas.getContext('2d');
  });
});