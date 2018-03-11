function PentaStyles(ctx) {
  this.ctx = ctx;

  this.ctx.lineWidth = 1.75;
  this.ctx.lineJoin = "round";

  this.colors = {
    black: this.color(0, 0, 0),
    white: this.color(255, 255, 255),
    red: this.color(255, 0, 0),
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
    green: this.alpha(this.colors.green, 0),
    blue: this.alpha(this.colors.blue, 0),
    yellow: this.alpha(this.colors.yellow, 0),
    magenta: this.alpha(this.colors.magenta, 0),
    cyan: this.alpha(this.colors.cyan, 0)
  };

  this.colors.dark = {
    red: this.dark(this.colors.red),
    green: this.dark(this.colors.green),
    blue: this.dark(this.colors.blue),
    yellow: this.dark(this.colors.yellow),
    magenta: this.dark(this.colors.magenta),
    cyan: this.dark(this.colors.cyan)
  };

  this.strokes = {
    white: this.stroke(this.colors.white),
    red: this.stroke(this.colors.red),
    green: this.stroke(this.colors.green),
    blue: this.stroke(this.colors.blue),
    yellow: this.stroke(this.colors.yellow),
    magenta: this.stroke(this.colors.magenta),
    cyan: this.stroke(this.colors.cyan),

    bright: {
      red: this.stroke(this.bright(this.colors.red)),
      green: this.stroke(this.bright(this.colors.green)),
      blue: this.stroke(this.bright(this.colors.blue)),
      yellow: this.stroke(this.bright(this.colors.yellow)),
      magenta: this.stroke(this.bright(this.colors.magenta)),
      cyan: this.stroke(this.bright(this.colors.cyan))
    },

    dark: {
      red: this.stroke(this.dark(this.colors.red)),
      green: this.stroke(this.dark(this.colors.green)),
      blue: this.stroke(this.dark(this.colors.blue)),
      yellow: this.stroke(this.dark(this.colors.yellow)),
      magenta: this.stroke(this.dark(this.colors.magenta)),
      cyan: this.stroke(this.dark(this.colors.cyan))
    }
  };

  this.fills = {
    white: this.fill(this.colors.white),
    red: this.fill(this.colors.red),
    green: this.fill(this.colors.green),
    blue: this.fill(this.colors.blue),
    yellow: this.fill(this.colors.yellow),
    magenta: this.fill(this.colors.magenta),
    cyan: this.fill(this.colors.cyan),

    light: {
      red: this.fill(this.light(this.colors.red)),
      green: this.fill(this.light(this.colors.green)),
      blue: this.fill(this.light(this.colors.blue)),
      yellow: this.fill(this.light(this.colors.yellow)),
      magenta: this.fill(this.light(this.colors.magenta)),
      cyan: this.fill(this.light(this.colors.cyan))
    },

    bright: {
      red: this.fill(this.bright(this.colors.red)),
      green: this.fill(this.bright(this.colors.green)),
      blue: this.fill(this.bright(this.colors.blue)),
      yellow: this.fill(this.bright(this.colors.yellow)),
      magenta: this.fill(this.bright(this.colors.magenta)),
      cyan: this.fill(this.bright(this.colors.cyan))
    }
  };

  this.fills.aShineOf = {
    red: this.makeAShineOf(this.colors.light.red),
    green: this.makeAShineOf(this.colors.light.green),
    blue: this.makeAShineOf(this.colors.light.blue),
    yellow: this.makeAShineOf(this.colors.light.yellow),
    magenta: this.makeAShineOf(this.colors.light.magenta),
    cyan: this.makeAShineOf(this.colors.light.cyan),
  };

  this.fills.aGlowOf = {
    red: this.makeAGlowOf(this.colors.red),
    green: this.makeAGlowOf(this.colors.green),
    blue: this.makeAGlowOf(this.colors.blue),
    yellow: this.makeAGlowOf(this.colors.yellow),
    magenta: this.makeAGlowOf(this.colors.magenta),
    cyan: this.makeAGlowOf(this.colors.cyan),
  };


  this.dashes = {
    none: [],
    finest: [1, 6],
    fine: [2, 5],
    gross: [4, 3],
  };
};

let PS = PentaStyles;

//
// colors

PS.prototype.color = function(r, g, b, a) {
  r = Math.min(255, Math.max(0, Math.round(r)));
  g = Math.min(255, Math.max(0, Math.round(g)));
  b = Math.min(255, Math.max(0, Math.round(b)));
  a = (typeof a === 'number') ? a : 1.0;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

PS.prototype.colorFromString = function(colorStr) {
  colorStr = colorStr.trim();
  let values = colorStr.substring(5, colorStr.length - 1);
  return values.split(',').map(str => parseInt(str));
};

PS.prototype.radialGradient = function(penta, color0, color1) {
  let gradient = this.ctx.createRadialGradient(penta.x, penta.y, penta.radius, penta.x, penta.y, 0.5 * penta.radius);
  gradient.addColorStop(0, color0);
  gradient.addColorStop(1, color1);
  return this.fill(gradient);
};

PS.prototype.getRadialGradientMaker = function(innerColor, outerColor) {
  let that = this;
  return function(penta) {
    return that.radialGradient(penta, innerColor, outerColor);
  }
};

PS.prototype.makeAShineOf = function(color) {
  let otherColor = this.alpha(color, 0);
  return this.getRadialGradientMaker(color, otherColor);
};

PS.prototype.makeAGlowOf = function(color) {
  let otherColor = this.alpha(color, 0);
  return this.getRadialGradientMaker(otherColor, color);
};

PS.prototype.brightIncrement = 100;
PS.prototype.darkDecrement = -100;

PS.prototype.bright = function(colorStr, brightIncrement) {
  brightIncrement = brightIncrement || this.brightIncrement;
  let rgba = this.colorFromString(colorStr);
  return this.color(
    rgba[0] + brightIncrement,
    rgba[1] + brightIncrement,
    rgba[2] + brightIncrement,
    rgba[3]
  );
};

PS.prototype.dark = function(colorStr, darkDecrement) {
  return this.bright(colorStr, darkDecrement || this.darkDecrement)
};

PS.prototype.alpha = function(colorStr, alpha) {
  let rgba = this.colorFromString(colorStr);
  return this.color(rgba[0], rgba[1], rgba[2], alpha);
};

PS.prototype.lightFactor = 0.25;

PS.prototype.light = function(colorStr, lightFactor) {
  return this.alpha(colorStr, lightFactor || this.lightFactor);
};

//
// style properties

PS.prototype.stroke = function(color) {
  return {
    strokeStyle: color
  };
};

PS.prototype.fill = function(color) {
  return {
    fillStyle: color
  };
};

PS.prototype.lineWidth = function(width) {
  return {
    lineWidth: width
  };
}

PS.prototype.all = function(...styles) {
  return Object.assign.apply(Object.assign, [{}].concat(styles));
};
