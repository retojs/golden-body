function PentaPainterOps() {
  this.ctx = goldenContext.ctx;
  this.styler = new PentaTreeStyler()
}

PentaPainterOps.prototype.circle = function(penta, style, doFill) {
  this.styler.applyStyles(penta, style || penta.style);

  this.ctx.beginPath(penta.x, penta.y);
  this.ctx.arc(penta.x, penta.y, penta.radius, 0, PM.deg360);
  doFill ? this.ctx.fill() : this.ctx.stroke();
};

PentaPainterOps.prototype.fillCircle = function(penta, style) {
  this.circle(penta, style, true);
};

PentaPainterOps.prototype.pentagon = function(penta, style, doFill) {
  this.styler.applyStyles(penta, style || penta.style);

  this.ctx.beginPath();
  this.ctx.moveTo.apply(this.ctx, penta.p4);
  for (let i = 0; i < 5; i++) {
    this.ctx.lineTo.apply(this.ctx, penta['p' + i]);
  }
  doFill ? this.ctx.fill() : this.ctx.stroke();
};

PentaPainterOps.prototype.fillPentagon = function(penta, style) {
  this.pentagon(penta, style, true);
}

PentaPainterOps.prototype.pentagram = function(penta, style) {
  this.styler.applyStyles(penta, style || penta.style);

  this.ctx.beginPath();
  this.ctx.moveTo.apply(this.ctx, penta.p3);
  for (let i = 0; i < 10; i += 2) {
    this.ctx.lineTo.apply(this.ctx, penta['p' + i % 5]);
  }
  this.ctx.stroke();
};

PentaPainterOps.prototype.fillPentagram = function(penta, style) {
  this.styler.applyStyles(penta, style || penta.style);

  let core = penta.createCore();

  this.ctx.beginPath();
  this.ctx.moveTo.apply(this.ctx, penta.p0);
  this.ctx.lineTo.apply(this.ctx, core.p0);
  for (let i = 0; i < 5; i++) {
    this.ctx.lineTo.apply(this.ctx, penta['p' + i]);
    this.ctx.lineTo.apply(this.ctx, core['p' + i]);
  }
  this.ctx.fill();
};

PentaPainterOps.prototype.star = function(penta, style) {
  this.styler.applyStyles(penta, style || penta.style);

  let core = penta.createCore();

  this.ctx.beginPath();
  this.ctx.moveTo.apply(this.ctx, penta.p0);
  this.ctx.lineTo.apply(this.ctx, core.p0);
  for (let i = 0; i < 5; i++) {
    this.ctx.lineTo.apply(this.ctx, penta['p' + i]);
    this.ctx.lineTo.apply(this.ctx, core['p' + i]);
  }
  this.ctx.lineTo.apply(this.ctx, penta.p0);
  this.ctx.stroke();
};

/**
 * Returns a promise that is resolved when the background image's onload event occurs.
 */
PentaPainterOps.prototype.paintBgrImage = function(url, width, height) {
  let bgrImage = new Image();
  bgrImage.src = url;

  /**
   * A new Promise is created from an executor function
   * with two callback function arguments (resolve, reject).
   * In the executor function body you subscribe these callbacks
   * to any asynchronous events in the future.
   *
   * The Promise's then() method can be used to subscribe to resolve() and reject().
   */
  return new Promise((resolve, reject) => {
    bgrImage.onload = () => {
      this.ctx.drawImage(bgrImage, 0, -120);
      resolve();
    }
  });
};
