function PentaStyles() {
  let ctx = goldenContext.ctx;

  ctx.lineWidth = 1.75;
  ctx.lineJoin = "round";

  this.colors = {
    black: this.color(0, 0, 0),
    white: this.color(255, 255, 255),
    red: this.color(255, 0, 0),
    orange: this.color(255, 85, 0),
    green: this.color(0, 255, 0),
    blue: this.color(0, 0, 255),
    yellow: this.color(255, 255, 0),
    magenta: this.color(255, 0, 255),
    cyan: this.color(0, 255, 255)
  };

  this.colors.light = {
    black: this.light(this.colors.black),
    white: this.light(this.colors.white),
    red: this.light(this.colors.red),
    orange: this.light(this.colors.orange),
    green: this.light(this.colors.green),
    blue: this.light(this.colors.blue),
    yellow: this.light(this.colors.yellow),
    magenta: this.light(this.colors.magenta),
    cyan: this.light(this.colors.cyan)
  };

  this.colors.transparent = {
    black: this.alpha(this.colors.black, 0),
    white: this.alpha(this.colors.white, 0),
    red: this.alpha(this.colors.red, 0),
    orange: this.alpha(this.colors.orange, 0),
    green: this.alpha(this.colors.green, 0),
    blue: this.alpha(this.colors.blue, 0),
    yellow: this.alpha(this.colors.yellow, 0),
    magenta: this.alpha(this.colors.magenta, 0),
    cyan: this.alpha(this.colors.cyan, 0)
  };

  this.colors.dark = {
    red: this.dark(this.colors.red),
    orange: this.dark(this.colors.orange),
    green: this.dark(this.colors.green),
    blue: this.dark(this.colors.blue),
    yellow: this.dark(this.colors.yellow),
    magenta: this.dark(this.colors.magenta),
    cyan: this.dark(this.colors.cyan)
  };

  this.strokes = {
    white: this.stroke(this.colors.white),
    red: this.stroke(this.colors.red),
    orange: this.stroke(this.colors.orange),
    green: this.stroke(this.colors.green),
    blue: this.stroke(this.colors.blue),
    yellow: this.stroke(this.colors.yellow),
    magenta: this.stroke(this.colors.magenta),
    cyan: this.stroke(this.colors.cyan),

    bright: {
      red: this.stroke(this.bright(this.colors.red)),
      orange: this.stroke(this.bright(this.colors.orange)),
      green: this.stroke(this.bright(this.colors.green)),
      blue: this.stroke(this.bright(this.colors.blue)),
      yellow: this.stroke(this.bright(this.colors.yellow)),
      magenta: this.stroke(this.bright(this.colors.magenta)),
      cyan: this.stroke(this.bright(this.colors.cyan))
    },

    dark: {
      red: this.stroke(this.dark(this.colors.red)),
      orange: this.stroke(this.dark(this.colors.orange)),
      green: this.stroke(this.dark(this.colors.green)),
      blue: this.stroke(this.dark(this.colors.blue)),
      yellow: this.stroke(this.dark(this.colors.yellow)),
      magenta: this.stroke(this.dark(this.colors.magenta)),
      cyan: this.stroke(this.dark(this.colors.cyan))
    }
  };

  this.fills = {
    transparent: this.fill(this.colors.transparent.black),
    white: this.fill(this.colors.white),
    red: this.fill(this.colors.red),
    orange: this.fill(this.colors.orange),
    green: this.fill(this.colors.green),
    blue: this.fill(this.colors.blue),
    yellow: this.fill(this.colors.yellow),
    magenta: this.fill(this.colors.magenta),
    cyan: this.fill(this.colors.cyan),

    light: {
      red: this.fill(this.light(this.colors.red)),
      orange: this.fill(this.light(this.colors.orange)),
      green: this.fill(this.light(this.colors.green)),
      blue: this.fill(this.light(this.colors.blue)),
      yellow: this.fill(this.light(this.colors.yellow)),
      magenta: this.fill(this.light(this.colors.magenta)),
      cyan: this.fill(this.light(this.colors.cyan))
    },

    bright: {
      red: this.fill(this.bright(this.colors.red)),
      orange: this.fill(this.bright(this.colors.orange)),
      green: this.fill(this.bright(this.colors.green)),
      blue: this.fill(this.bright(this.colors.blue)),
      yellow: this.fill(this.bright(this.colors.yellow)),
      magenta: this.fill(this.bright(this.colors.magenta)),
      cyan: this.fill(this.bright(this.colors.cyan))
    }
  };

  this.fills.aShineOf = {
    white: this.makeAShineOf(this.colors.white),
    red: this.makeAShineOf(this.colors.red),
    orange: this.makeAShineOf(this.colors.orange),
    green: this.makeAShineOf(this.colors.green),
    blue: this.makeAShineOf(this.colors.blue),
    yellow: this.makeAShineOf(this.colors.yellow),
    magenta: this.makeAShineOf(this.colors.magenta),
    cyan: this.makeAShineOf(this.colors.cyan),
  };

  this.fills.aGlowOf = {
    white: this.makeAGlowOf(this.colors.white),
    red: this.makeAGlowOf(this.colors.red),
    orange: this.makeAGlowOf(this.colors.orange),
    green: this.makeAGlowOf(this.colors.green),
    blue: this.makeAGlowOf(this.colors.blue),
    yellow: this.makeAGlowOf(this.colors.yellow),
    magenta: this.makeAGlowOf(this.colors.magenta),
    cyan: this.makeAGlowOf(this.colors.cyan),
  };

  this.colors.alpha = [];
  this.strokes.alpha = [];
  this.fills.alpha = [];

  for (let alpha = 1; alpha < 10; alpha++) {
    this.colors.alpha[alpha] = {};
    this.strokes.alpha[alpha] = {};
    this.fills.alpha[alpha] = {};

    Object.keys(this.colors).forEach(key => {
      if (typeof this.colors[key] === 'string') {
        this.colors.alpha[alpha][key] = this.alpha(this.colors[key], alpha / 10);
        this.strokes.alpha[alpha][key] = { strokeStyle: this.alpha(this.colors[key], alpha / 10) };
        this.fills.alpha[alpha][key] = { fillStyle: this.alpha(this.colors[key], alpha / 10) };
      }
    });
  }

  this.strokes.mix = function (color1, color2, weight1, weight2) {
    return { strokeStyle: goldenContext.pentaStyles.mixColors(color1, color2, weight1, weight2) };
  }

  this.fills.mix = function (color1, color2, weight1, weight2) {
    return { fillStyle: goldenContext.pentaStyles.mixColors(color1, color2, weight1, weight2) };
  }

  this.dashes = {
    none: [],
    finest: [1, 6],
    fine: [2, 5],
    gross: [4, 3],
  };
};

//
// colors

PentaStyles.prototype.color = function (r, g, b, a) {
  r = Math.min(255, Math.max(0, Math.round(r)));
  g = Math.min(255, Math.max(0, Math.round(g)));
  b = Math.min(255, Math.max(0, Math.round(b)));
  a = (typeof a === 'number') ? a : 1.0;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

PentaStyles.prototype.colorFromString = function (colorStr) {
  colorStr = colorStr.trim();
  let values = colorStr.substring(5, colorStr.length - 1);
  return values.split(',').map(str => parseFloat(str));
};

PentaStyles.prototype.mixColors = function (color1, color2, weight1, weight2) {
  let col1 = this.colorFromString(color1);
  let col2 = this.colorFromString(color2);
  let w1 = weight1 || 1.0;
  let w2 = weight2 || 1.0;
  let wf1 = w1 / (w1 + w2);
  let wf2 = w2 / (w1 + w2);
  return this.color(
    col1[0] * wf1 + col2[0] * wf2,
    col1[1] * wf1 + col2[1] * wf2,
    col1[2] * wf1 + col2[2] * wf2,
    col1[3] * wf1 + col2[3] * wf2
  )
};

PentaStyles.prototype.radialGradient = function (penta, innerColor, outerColor, rangeFrom, rangeTo) {
  let gradient = goldenContext.ctx.createRadialGradient(penta.x, penta.y, rangeFrom * penta.radius, penta.x, penta.y, rangeTo * penta.radius);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, outerColor);
  return gradient;
};

PentaStyles.prototype.getRadialGradientFillStyleMaker = function (innerColor, outerColor, rangeFrom, rangeTo) {
  let that = this;
  return {
    fillStyle: function (penta) {
      return that.radialGradient(penta, innerColor, outerColor, rangeFrom, rangeTo)
    }
  }
};

PentaStyles.prototype.makeAShineOf = function (color, alpha, range) {
  alpha = alpha || this.lightAlpha;
  range = range || PM.gold_;
  let transparentColor = this.alpha(color, 0);
  color = this.alpha(color, alpha);
  return this.getRadialGradientFillStyleMaker(transparentColor, color, range, 1);
};

PentaStyles.prototype.makeAGlowOf = function (color, alpha) {
  alpha = alpha || this.lightAlpha;
  let transparentColor = this.alpha(color, 0);
  color = this.alpha(color, 1 - alpha);
  return this.getRadialGradientFillStyleMaker(color, transparentColor, 0, PM.out2in);
};

PentaStyles.prototype.brightIncrement = 100;
PentaStyles.prototype.darkDecrement = -100;

PentaStyles.prototype.bright = function (colorStr, brightIncrement) {
  brightIncrement = brightIncrement || this.brightIncrement;
  let rgba = this.colorFromString(colorStr);
  return this.color(
    rgba[0] + brightIncrement,
    rgba[1] + brightIncrement,
    rgba[2] + brightIncrement,
    rgba[3]
  );
};

PentaStyles.prototype.dark = function (colorStr, darkDecrement) {
  return this.bright(colorStr, darkDecrement || this.darkDecrement)
};

PentaStyles.prototype.alpha = function (colorStr, alpha) {
  let rgba = this.colorFromString(colorStr);
  return this.color(rgba[0], rgba[1], rgba[2], alpha);
};

PentaStyles.prototype.lightAlpha = 0.25;

PentaStyles.prototype.light = function (colorStr, lightAlpha) {
  return this.alpha(colorStr, lightAlpha || this.lightAlpha);
};

//
// style properties

PentaStyles.prototype.stroke = function (color) {
  return {
    strokeStyle: color
  };
};

PentaStyles.prototype.fill = function (color) {
  return {
    fillStyle: color
  };
};

PentaStyles.prototype.lineWidth = function (width) {
  return {
    lineWidth: width
  };
}

PentaStyles.prototype.all = function (...styles) {
  return Object.assign.apply(Object.assign, [{}].concat(styles));
};
