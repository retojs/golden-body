let goldenContext = (function() {

  let g = {
    size: 120,
    origin: [447, 470],
  };

  g.canvas = document.getElementById('golden-body-canvas');
  g.ctx = g.canvas.getContext('2d');
  g.pentaStyle = new PentaStyles(g.ctx);

  g.setup = function() {
    this.painter = new PentaPainter();
    this.goldenBody = new GoldenBody(this.origin, this.size, PM.deg90);
    this.painter.paintGoldenBody(this.goldenBody);
  }

  return g;
})();

goldenContext.setup();
