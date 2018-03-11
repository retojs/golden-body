function GoldenSpots(penta, radius, options) {
  this.penta = penta;
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
    // don't replace all options but overwrite single option properties
    clone.options = Object.assign({}, this.options, config.options);
  }
  return clone;
};

GoldenSpots.prototype.toString = function() {
  return "GoldenSpots: " +
    "penta.center=[" + Math.round(this.penta.x) + ", " + Math.round(this.penta.y) + "]" +
    ", radius=" + Math.round(this.radius) +
    ", options=" + this.options;
}

/**
 * applies gradient functions to a specific spot with a specific position and radius
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
