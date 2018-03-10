function PentaStyles(ctx) {
  this.ctx = ctx;

  this.ctx.lineWidth = 1.75;
  this.ctx.lineJoin = "round";

  this.colors = {
    red: this.color(255, 0, 0),
    green: this.color(0, 255, 0),
    blue: this.color(0, 0, 255),
    yellow: this.color(255, 255, 0),
    magenta: this.color(255, 0, 255),
    cyan: this.color(0, 255, 255),
  };

  this.strokes = {
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
    red: this.fill(this.colors.red),
    green: this.fill(this.colors.green),
    blue: this.fill(this.colors.blue),
    yellow: this.fill(this.colors.yellow),
    magenta: this.fill(this.colors.magenta),
    cyan: this.fill(this.colors.cyan),

    weak: {
      red: this.fill(this.weak(this.colors.red)),
      green: this.fill(this.weak(this.colors.green)),
      blue: this.fill(this.weak(this.colors.blue)),
      yellow: this.fill(this.weak(this.colors.yellow)),
      magenta: this.fill(this.weak(this.colors.magenta)),
      cyan: this.fill(this.weak(this.colors.cyan))
    }
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
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  a = (typeof a === 'number') ? a : 1.0;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

PS.prototype.colorFromString = function(colorStr) {
  colorStr = colorStr.trim();
  let values = colorStr.substring(5, colorStr.length - 1);
  return values.split(',');
};

PS.prototype.gradient = function(penta, color0, color1) {
  let gradient = this.ctx.createRadialGradient(penta.x, penta.y, penta.radius, penta.x, penta.y, 0.5 * penta.radius);
  gradient.addColorStop(0, color0);
  gradient.addColorStop(1, color1);
  return this.fill(gradient);
};

PS.prototype.brightFactor = 1.5;
PS.prototype.darkFactor = 0.67;

PS.prototype.bright = function(colorStr, brightFactor) {
  brightFactor = brightFactor || this.brightFactor;
  let rgba = this.colorFromString(colorStr);
  return this.color(
    rgba[0] * brightFactor,
    rgba[1] * brightFactor,
    rgba[2] * brightFactor,
    rgba[3]
  );
};

PS.prototype.dark = function(colorStr, darkFactor) {
  return this.bright(colorStr, darkFactor || this.darkFactor)
};

PS.prototype.alpha = function(colorStr, alpha) {
  let rgba = this.colorFromString(colorStr);
  return this.color(rgba[0], rgba[1], rgba[2], alpha);
};

PS.prototype.weakFactor = 0.25;

PS.prototype.weak = function(colorStr, weakFactor) {
  return this.alpha(colorStr, weakFactor || this.weakFactor);
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
