/**
 * Defines the appearence of Golden Spots.
 *
 * @property radius: The radius of each Golden Spot
 * @property options: an object with property names matching PentaPainterOps methods.
 *                    {
 *                      fillCircle: canvas styles,
 *                      drawCircle: canvas styles,
 *                      fillStar: canvas styles,
 *                      drawStar: canvas styles
 *                    }
 *
 *                    Each property contains a list of canvas style properties
 *                    which will be passed the matching PentaPainterOps method.
 */
function GoldenSpots(radius, options) {
  this.radius = radius || 1;
  this.options = options;
}

function isGoldenSpots(obj) {
  return obj && obj.constructor && obj.constructor.name === 'GoldenSpots';
}

GoldenSpots.prototype.clone = function(config) {
  let clone = new GoldenSpots();
  Object.assign(clone, this, config);
  if (config && config.options) {
    // don't just replace all options but overwrite single option properties
    clone.options = Object.assign({}, this.options, config.options);
  }
  return clone;
};

GoldenSpots.prototype.toString = function() {
  return "GoldenSpots: " +
    ", radius=" + Math.round(this.radius) +
    ", options=" + this.options;
}

/**
 * Applies gradient functions in the Golden Spot's options property
 * to a specific spot with a specific position and radius.
 *
 * This is a prerequisite for passing the styles to any PentaPainterOps.
 */
GoldenSpots.prototype.getSpotOptions = function(spotPenta) {
  return Object.keys(this.options).reduce((options, key) => {
    if (typeof this.options[key] === 'function') {
      options[key] = this.options[key](spotPenta);
    } else {
      options[key] = this.options[key];
    }
    return options;
  }, {});
}
