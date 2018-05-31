let goldenContext = {
  scale: 4,
  size: 480,
  origin: [1788, 1880],
};

goldenContext.canvas = document.getElementById('golden-body-canvas');
goldenContext.ctx = goldenContext.canvas.getContext('2d');
goldenContext.pentaStyles = new PentaStyles();

setupPentaDragNDrop();
setupCanvasZoomNTranslate();
setupPaintOrderEditing();
setupPaintOrderSelection();

goldenContext.setup = function () {
  this.painter = new PentaPainter();
  this.goldenBody = new GoldenBody(this.origin, this.size, PM.deg90);
  this.painter.paintGoldenBody(this.goldenBody);
}
goldenContext.setup();

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


// TEST

let angle = PM.angle([11, 0]);
console.log("TEST angle=0? ", angle, PM.toDeg(angle));
angle = PM.angle([11, 11]);
console.log("TEST angle=45? ", angle, PM.toDeg(angle));
 angle = PM.angle([0, 11]);
console.log("TEST angle=90? ", angle, PM.toDeg(angle));
angle = PM.angle([-11, 11]);
console.log("TEST angle=135? ", angle, PM.toDeg(angle));
angle = PM.angle([-11, 0]);
console.log("TEST angle=180? ", angle, PM.toDeg(angle));
angle = PM.angle([-11, -11]);
console.log("TEST angle=225?", angle, PM.toDeg(angle));
angle = PM.angle([0, -11]);
console.log("TEST angle=270? ", angle, PM.toDeg(angle));
angle = PM.angle([11, -11]);
console.log("TEST angle=315", angle, PM.toDeg(angle));