function PentaPainter(ctx, width, height) {
  this.ctx = ctx;
  this.width = width;
  this.height = height;
  this.PS = new PentaStyle(ctx);
}
// close-up
//PentaPainter.bgrImage = 'https://dl.dropboxusercontent.com/s/3covvimcz5gfrui/golden-spots--physiological-model--square-1004px.png'
// far-off
//PentaPainter.bgrImage = 'https://dl.dropboxusercontent.com/s/3covvimcz5gfrui/golden-spots--physiological-model--square-1004px.png'
// golden proportions
PentaPainter.bgrImage = 'https://dl.dropboxusercontent.com/s/l6qxx5gssmovn8n/physiological-model--golden-proportion-format.png'

PentaPainter.prototype.circle = function(penta, style, doFill) {
  this.applyStyle(style || penta.style);

  this.ctx.beginPath(penta.x, penta.y);
  this.ctx.arc(penta.x, penta.y, penta.radius, 0, PM.deg360);
  doFill ? this.ctx.fill() : this.ctx.stroke();
};

PentaPainter.prototype.fillCircle = function(penta, style) {
  this.circle(penta, style, true);
};

PentaPainter.prototype.pentagon = function(penta, style, doFill) {
  this.applyStyle(style || penta.style);

  this.ctx.beginPath();
  this.ctx.moveTo.apply(this.ctx, penta.p4);
  for (let i = 0; i < 5; i++) {
    this.ctx.lineTo.apply(this.ctx, penta['p' + i]);
  }
  doFill ? this.ctx.fill() : this.ctx.stroke();
};

PentaPainter.prototype.fillPentagon = function(penta, style) {
  this.pentagon(penta, style, true);
}

PentaPainter.prototype.pentagram = function(penta, style) {
  this.applyStyle(style || penta.style);

  this.ctx.beginPath();
  this.ctx.moveTo.apply(this.ctx, penta.p3);
  for (let i = 0; i < 10; i += 2) {
    this.ctx.lineTo.apply(this.ctx, penta['p' + i % 5]);
  }
  this.ctx.stroke();
};

PentaPainter.prototype.fillPentagram = function(penta, style) {
  this.applyStyle(style || penta.style);

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

/**
 * Returns a promise that is resolved when the background image's onload event occurs.
 */
PentaPainter.prototype.paintBgrImage = function(width, height) {
  let bgrImage = new Image();
  bgrImage.src = PentaPainter.bgrImage;

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

/**
 * Paints each penta of the specified golden body
 * and assigns the styles from the golden body styleTree
 * according to the property path of the penta using PentaPainter.assignStyles()
 */
PentaPainter.prototype.paintGoldenBody = function(goldenBody) {

  goldenBody.createStyleTree(this.PS);

  /**
   * Here we are using a Promise to wait for the background image
   * to be loaded and painted on the canvas,
   * before we're painting the penta-model on top of it.
   */
  //this.paintBgrImage().then(() => this.paintSubtree(goldenBody));

  this.paintBgrImage().then(() => {
    this.ctx.setLineDash(this.PS.dashes.none);
    this.paintPropertySubtree(goldenBody, 'supers');
    this.paintPropertySubtree(goldenBody, 'extremities');
    this.paintPropertySubtree(goldenBody, 'inner');
    this.paintPropertySubtree(goldenBody, 'outer');
    this.paintPropertySubtree(goldenBody, 'middle');
    this.paintPropertySubtree(goldenBody, 'cores');
  });
};

PentaPainter.prototype.paintPropertySubtree = function(goldenBody, propertyPath) {
  let pathArray = propertyPath.split('.');
  if (!Array.isArray(propertyPath)) propertyPath = [propertyPath];
  this.paintSubtree(goldenBody, goldenBody.getPentaSubtree(propertyPath), propertyPath);
}

PentaPainter.prototype.paintSubtree = function(goldenBody, subtree, propertyPath) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPath = propertyPath || [];

  if (isPenta(subtree)) {
    let penta = subtree;
    //      let nextPath = propertyPath.concat([key]);
    let nextPath = propertyPath;

    this.assignStyles(goldenBody.styleTree, nextPath);

    this.circle(penta);
    this.pentagon(penta);
    this.pentagram(penta);
    if (nextPath.indexOf('extremities') > -1) {
      this.ctx.setLineDash(this.PS.dashes.fine);
    }
    if (nextPath.indexOf('supers') > -1) {
      this.fillCircle(penta);
      if (nextPath.indexOf('upper') > -1) {
        this.fillPentagon(penta);
      }
      if (nextPath.indexOf('lower') > -1) {
        this.fillPentagram(penta);
      }
    }
    if (nextPath.indexOf('outer') > -1) {
      this.fillPentagram(penta);
    }
    if (nextPath.indexOf('inner') > -1) {
      this.fillPentagon(penta);
    }
    if (nextPath.indexOf('middle') > -1 || nextPath.indexOf('lowerMiddle') > -1) {
      this.fillPentagon(penta);
    }
  } else {
    Object.keys(subtree).forEach(key => {
      this.paintSubtree(goldenBody, subtree[key], propertyPath.concat([key]));
    });
  }
};

//
// paint styles

PentaPainter.styleProperties = [
  'strokeStyle',
  'fillStyle',
  'lineWidth',
  'lineJoin'
];

PentaPainter.prototype.applyStyle = function(style) {
  if (style) {
    Object.assign(this.ctx, style)
  }
};

PentaPainter.prototype.clearStyles = function() {
  this.ctx.strokeStyle = "#000";
  this.ctx.fillStyle = "#000";
  this.ctx.lineWidth = 1;
  this.ctx.lineJoin = 'round';
  this.ctx.setLineDash([]);
};

/**
 * Traverses the specified style tree along the specified property path and
 * assigns all style properties to this.ctx in each step.
 */
PentaPainter.prototype.assignStyles = function(styleTree, propertyPath) {
  if (!propertyPath) return;

  this.clearStyles();
  propertyPath.concat(['sentinel']).reduce((style, property) => {
    if (!style) return {};
    Object.assign(this.ctx, getStyleProps(style));
    return style[property];
  }, styleTree);

  function getStyleProps(style) {
    return Object.keys(style).reduce((memo, key) => {
      if (PentaPainter.styleProperties.indexOf(key) > -1) {
        memo[key] = style[key]
      }
      return memo
    }, {});
  }
}
