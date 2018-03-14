let goldenContext = (function() {

  let gc = {
    size: 120,
    origin: [447, 470],
  };

  gc.canvas = document.getElementById('golden-body-canvas');
  gc.ctx = gc.canvas.getContext('2d');
  gc.pentaStyle = new PentaStyles(gc.ctx);

  gc.setup = function() {
    this.painter = new PentaPainter();
    this.goldenBody = new GoldenBody(this.origin, this.size, PM.deg90);
    this.painter.paintGoldenBody(this.goldenBody);
  }

  return gc;
})();

goldenContext.setup();
