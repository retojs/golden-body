function GoldenSpots(penta, radius, options) {
  this.penta = penta;
  this.radius = radius || 1;
  this.options = options;
}

function isGoldenSpots(obj) {
  return obj && obj.constructor && obj.constructor.name === 'GoldenSpots';
}

GoldenSpots.prototype.toString = function() {
  return "GoldenSpots: " +
    "penta.center=[" + Math.round(this.penta.x) + ", " + Math.round(this.penta.y) + "]" +
    ", radius=" + Math.round(this.radius) +
    ", options=" + this.options +
    ", styles=" + this.styles;
}

GoldenSpots.optionsStarWithCircle = {
  fillCircle: true,
  fillStar: true,
  drawStar: true
};
