/**
 * Idea for a flexible style configuration:
 * 
 *  A style configuration contains properties of the CanvasRenderingContext2D
 *  They can either be specified on root level of the style object:
 * 
 *    style = {
 *      strokeStyle: '#f04'
 *      fillStyle: '#ffa'
 *      lineWidth: 2
 *      lineJoin: 'round'
 *    }
 * 
 *  or they can be assigned to certain parts of the golden Body shape:
 * 
 *    style = {
 *      upper: {
 *        lineWidth: 3,  
 *        inner: {
 *          fillStyle: '#245233',
 *        }
 *        outer: {}
 *          fillStyle: '#253434',
 *        }
 *      },
 *      lower: {
 *        inner: { ... }
 *        outer: { ... }
 *      }
 *      middle: { ... }
 *    }
 * 
 *  PentaPainter.assignStyles() will assign all styles such that 
 *  more specific styles will overwrite more general styles.
 */

let PentaStyle = {};
let PS = PentaStyle;

PS.color = function(r, g, b, a) {
  a = a || 0.834;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

PS.colorFromString = function(colorStr) {
  colorStr = colorStr.trim();
  let values = colorStr.substring(5, colorStr.length - 1);
  return values.split(',');
}

PS.alpha = function(colorStr, a) {
  let rgba = PS.colorFromString(colorStr);
  return PS.color(rgba[0], rgba[1], rgba[2], a);
}

PS.lightFactor = 0.25;

PS.light = function(colorStr) {
  return PS.alpha(colorStr, PS.lightFactor);
}

PS.stroke = function(color) {
  return {
    strokeStyle: color
  };
}

PS.fill = function(color) {
  return {
    fillStyle: color
  };
}

PS.all = function(...styles) {
  return Object.assign.apply(Object.assign, [{}].concat(styles));
}

PS.colors = {
  red: PS.color(255, 0, 0),
  green: PS.color(0, 255, 0),
  blue: PS.color(0, 0, 255),
  yellow: PS.color(255, 255, 0),
  magenta: PS.color(255, 0, 255),
  cyan: PS.color(0, 255, 255),
};

PS.strokes = {
  red: PS.stroke(PS.colors.red),
  green: PS.stroke(PS.colors.green),
  blue: PS.stroke(PS.colors.blue),
  yellow: PS.stroke(PS.colors.yellow),
  magenta: PS.stroke(PS.colors.magenta),
  cyan: PS.stroke(PS.colors.cyan),

  light: {
    red: PS.stroke(PS.light(PS.colors.red)),
    green: PS.stroke(PS.light(PS.colors.green)),
    blue: PS.stroke(PS.light(PS.colors.blue)),
    yellow: PS.stroke(PS.light(PS.colors.yellow)),
    magenta: PS.stroke(PS.light(PS.colors.magenta)),
    cyan: PS.stroke(PS.light(PS.colors.cyan))
  }
};

PS.fills = {
  red: PS.fill(PS.colors.red),
  green: PS.fill(PS.colors.green),
  blue: PS.fill(PS.colors.blue),
  yellow: PS.fill(PS.colors.yellow),
  magenta: PS.fill(PS.colors.magenta),
  cyan: PS.fill(PS.colors.cyan),

  light: {
    red: PS.fill(PS.light(PS.colors.red)),
    green: PS.fill(PS.light(PS.colors.green)),
    blue: PS.fill(PS.light(PS.colors.blue)),
    yellow: PS.fill(PS.light(PS.colors.yellow)),
    magenta: PS.fill(PS.light(PS.colors.magenta)),
    cyan: PS.fill(PS.light(PS.colors.cyan))
  }
};