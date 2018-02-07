function Penta(center, radius, angle, style) {
  this.x = center ? center[0] || 0 : 0;
  this.y = center ? center[1] || 0 : 0;
  this.radius = radius || 1;
  this.angle = angle || 0;
  this.style = style;
  this.calc();
}

//
// Initialization

Penta.prototype.calc = function() {
  for (let i = 0; i < 5; i++) {
    this['p' + i] = [
      this.x - PM.px(this.radius, i * PM.deg72 + this.angle),
      this.y + PM.py(this.radius, i * PM.deg72 + this.angle)
    ]
  }
  this.calcMore();
};

Penta.prototype.calcMore = function() {
  let dx = this.p1[0] - this.p0[0];
  let dy = this.p1[1] - this.p0[1];
  this.sideWidth = PM.d(this.p0, this.p1);

  this.outerRadius = PM.outerRadius(this);
  this.innerRadius = PM.innerRadius(this);
};

Penta.prototype.clone = function(config) {
  let clone = new Penta();
  Object.assign(clone, this, config);
  clone.calc();
  return clone;
};

//
// Accessors

Penta.prototype.getCenter = function() {
  return [this.x, this.y];
}

//
// Modifiers

Penta.prototype.move = function(delta) {
  this.x += delta[0];
  this.y += delta[1];
  this.calc();
  return this;
};

Penta.moveAll = function(pentas, delta) {
  pentas.forEach((p) => p.move(delta));
};

Penta.prototype.resize = function(value) {
  if ('' + value === '' + parseInt(value)) { // if factor is integer
    this.radius = value; // then set value as new radius
  } else { // if value is float
    this.radius *= value; // multiply radius
  }
  this.calc();
  return this;
}

Penta.prototype.rotate = function(angle) {
  this.angle += angle;
  this.calc();
  return this;
}

Penta.prototype.setAngle = function(angle) {
  this.angle = angle;
  this.calc();
  return this;
};

Penta.prototype.setStyle = function(style) {
  this.style = style;
  return this;
};

Penta.prototype.addStyle = function(style) {
  this.style = Object.assign(this.style, style);
  return this;
};

//
// Factory functions

Penta.prototype.createEdges = function(radius) {
return [
      new Penta(this.p0, radius, 0 * PM.deg72),
      new Penta(this.p1, radius, 1 * PM.deg72),
      new Penta(this.p2, radius, 2 * PM.deg72),
      new Penta(this.p3, radius, 3 * PM.deg72),
      new Penta(this.p4, radius, 4 * PM.deg72)
    ];
};

Penta.prototype.createCore = function() {
  return this.clone({
    radius: this.radius * PM.gold_ * PM.gold_,
    angle: this.angle + PM.deg36
  })
};

Penta.prototype.createInner = function(style) {
  return new Penta(
    this.getCenter(),
    this.innerRadius,
    this.angle + PM.deg36,
    style);
};

Penta.prototype.getOuter = function(style) {
  return new Penta(
    this.getCenter(),
    this.outerRadius,
    this.angle + PM.deg36,
    style);
};