function PentaPainterOps() {
  this.styler = new PentaTreeStyler()
}

PentaPainterOps.prototype.opsList = ['drawCircle', 'fillCircle', 'drawPentagon', 'fillPentagon', 'drawPentagram', 'fillPentagram', 'drawStar', 'fillStar'];

/**
 * Copies all properties in the list of PentaPainterOps from the specified object into a new object.
 * 
 * @param {*} obj 
 */
PentaPainterOps.prototype.getOpsFrom = function (obj) {
  // TODO generic operation copyProperties
  return this.opsList.reduce((ops, op) => {
    ops[op] = obj[op];
    return ops
  }, {})
}

/**
 * Returns the styles per paint operation for the node with the specified path.
 * 
 * @returns: {[key from PentaPainterOps.prototype.opsList]: style properties}
 * @param StyleTree propertyPathArray 
 * @param string[] propertyPathArray 
 */
PentaPainterOps.prototype.getStylesPerOp = function (styleTree, propertyPathArray) {
  return this.styler.getCascadingProperties(styleTree, propertyPathArray, this.opsList);
};

PentaPainterOps.DO_PAINT_SEGMENTS = false;
PentaPainterOps.DO_PAINT_ORTHOGONALS = false;

PentaPainterOps.prototype.drawCircle = function (penta, style, doFill) {
  let ctx = goldenContext.ctx;
  this.styler.assignStyleProperties(style || penta.style, penta);

  // ctx.beginPath(penta.x, penta.y);
  // ctx.arc(penta.x, penta.y, penta.radius, 0, PM.deg360);
  // ctx.stroke();

  let lastEdge = penta.p4;
  let edge = lastEdge;
  ctx.beginPath();
  ctx.moveTo.apply(ctx, penta.p4);
  for (let i = 0; i < 5; i++) {
    edge = penta['p' + i];
    let orthogonal = PM.orthogonal(lastEdge, edge, PM.gold_ * PM.gold_ * 0.95);
    let c1 = PM.middle(lastEdge, orthogonal.p2, PM.gold_ * 0.95);
    let c2 = PM.middle(edge, orthogonal.p2, PM.gold_ * 0.95);
    ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], edge[0], edge[1]);
    lastEdge = edge;
  }

  doFill ? ctx.fill() : ctx.stroke();

  if (PentaPainterOps.DO_PAINT_SEGMENTS) {
    for (let i = 0; i < 5; i++) {
      edge = penta['p' + i];
      ctx.moveTo(penta.x, penta.y);
      ctx.lineTo(edge[0], edge[1]);
      ctx.stroke();
    }
  }

  if (PentaPainterOps.DO_PAINT_ORTHOGONALS) {
    lastEdge = penta.p4;
    for (let i = 0; i < 5; i++) {
      edge = penta['p' + i];
      let orthogonal = PM.orthogonal(lastEdge, edge, PM.gold_ * PM.gold_ * 0.95);
      ctx.beginPath();
      ctx.moveTo(orthogonal.p1[0], orthogonal.p1[1]);
      ctx.lineTo(orthogonal.p2[0], orthogonal.p2[1]);
      ctx.stroke();
      lastEdge = edge;
    }
  }
};

PentaPainterOps.prototype.fillCircle = function (penta, style) {
  this.drawCircle(penta, style, true);
};

PentaPainterOps.prototype.drawSimpleCircle = function (penta, style, doFill) {
  let ctx = goldenContext.ctx;
  this.styler.assignStyleProperties(style || penta.style, penta);

  ctx.beginPath(penta.x, penta.y);
  ctx.arc(penta.x, penta.y, penta.radius, 0, PM.deg360);

  doFill ? ctx.fill() : ctx.stroke();
};

PentaPainterOps.prototype.fillSimpleCircle = function (penta, style) {
  this.drawSimpleCircle(penta, style, true);
};

PentaPainterOps.prototype.drawPentagon = function (penta, style, doFill) {
  let ctx = goldenContext.ctx;
  this.styler.assignStyleProperties(style || penta.style, penta);

  ctx.beginPath();
  ctx.moveTo.apply(ctx, penta.p4);
  for (let i = 0; i < 5; i++) {
    ctx.lineTo.apply(ctx, penta['p' + i]);
  }
  doFill ? ctx.fill() : ctx.stroke();
};

PentaPainterOps.prototype.fillPentagon = function (penta, style) {
  this.drawPentagon(penta, style, true);
}

PentaPainterOps.prototype.drawPentagram = function (penta, style) {
  let ctx = goldenContext.ctx;
  this.styler.assignStyleProperties(style || penta.style, penta);

  ctx.beginPath();
  ctx.moveTo.apply(ctx, penta.p3);
  for (let i = 0; i < 10; i += 2) {
    ctx.lineTo.apply(ctx, penta['p' + i % 5]);
  }
  ctx.stroke();
};

PentaPainterOps.prototype.fillPentagram = function (penta, style) {
  let ctx = goldenContext.ctx;
  let core = penta.createCore();
  this.styler.assignStyleProperties(style || penta.style, penta);

  ctx.beginPath();
  ctx.moveTo.apply(ctx, penta.p0);
  ctx.lineTo.apply(ctx, core.p0);
  for (let i = 0; i < 5; i++) {
    ctx.lineTo.apply(ctx, penta['p' + i]);
    ctx.lineTo.apply(ctx, core['p' + i]);
  }
  ctx.fill();
};

PentaPainterOps.prototype.drawStar = function (penta, style) {
  let ctx = goldenContext.ctx;
  let core = penta.createCore();
  this.styler.assignStyleProperties(style || penta.style, penta);

  ctx.beginPath();
  ctx.moveTo.apply(ctx, penta.p0);
  ctx.lineTo.apply(ctx, core.p0);
  for (let i = 0; i < 5; i++) {
    ctx.lineTo.apply(ctx, penta['p' + i]);
    ctx.lineTo.apply(ctx, core['p' + i]);
  }
  ctx.lineTo.apply(ctx, penta.p0);
  ctx.stroke();
};


PentaPainterOps.prototype.fillStar = function (penta, style) {
  this.fillPentagram(penta, style);
};

/**
 * Returns a promise that is resolved when the background image's onload event occurs.
 */
PentaPainterOps.prototype.paintBgrImage = function (url) {
  let ctx = goldenContext.ctx;
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
      if (!goldenContext.hideBgrImage) {
        ctx.drawImage(bgrImage, 0, -480, goldenContext.canvas.width, goldenContext.canvas.width * goldenContext.bgrImageProportion);
      }
      resolve();
    }
  });
};
