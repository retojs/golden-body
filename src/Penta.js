function Penta(center, radius, angle, style) {
  this.x = center ? center[0] || 0 : 0;
  this.y = center ? center[1] || 0 : 0;
  this.radius = radius || 1;
  this.angle = angle || 0;
  this.style = style;
  this.calcPs();
}

function isPenta(obj) {
  return obj && obj.constructor && obj.constructor.name === 'Penta';
}

Penta.prototype.toString = function () {
  return "Penta: " +
    "center=[" + Math.round(this.x) + ", " + Math.round(this.y) + "]" +
    ", radius=" + Math.round(this.radius);
}

//
// Initialization

Penta.prototype.calcPs = function () {
  for (let i = 0; i < 5; i++) {
    // console.log("i * PM.deg72 + this.angle = ", i * PM.deg72 + this.angle);
    this['p' + i] = [
      this.x + PM.px(this.radius, i * PM.deg72 + this.angle),
      this.y + PM.py(this.radius, i * PM.deg72 + this.angle)
    ]
  }
  // for (let i = 0; i < 5; i++) {
  //   console.log((i === 0 ? "*": "") + "p" + i + " = " + PM.toDeg(this.getEdgeAngle(i)));
  // }
  this.calcMore();
};

Penta.prototype.calcMore = function () {
  let dx = this.p1[0] - this.p0[0];
  let dy = this.p1[1] - this.p0[1];
  this.sideWidth = PM.d(this.p0, this.p1);

  this.outerRadius = PM.outerRadius(this);
  this.innerRadius = PM.innerRadius(this);
};

Penta.prototype.clone = function (config) {
  let clone = new Penta();
  Object.assign(clone, this, config);
  clone.calcPs();
  return clone;
};

//
// Accessors

Penta.prototype.getCenter = function () {
  return [this.x, this.y];
}

//
// Modifiers

Penta.prototype.move = function (delta) {
  this.x += delta[0];
  this.y += delta[1];
  this.calcPs();
  return this;
};

Penta.moveAll = function (pentas, delta) {
  pentas.forEach((p) => p.move(delta));
};

Penta.prototype.resize = function (value) {
  if ('' + value === '' + parseInt(value)) { // if factor is integer
    this.radius = value; // then set value as new radius
  } else { // if value is float
    this.radius *= value; // multiply radius
  }
  this.calcPs();
  return this;
}

Penta.prototype.rotate = function (angle, center) {
  this.angle += angle;
  let d = PM.rotate([this.x, this.y], center, angle);
  this.x = d[0];
  this.y = d[1];
  this.calcPs();
  return this;
}

Penta.prototype.setAngle = function (angle) {
  this.angle = angle;
  this.calcPs();
  return this;
};

Penta.prototype.setStyle = function (style) {
  this.style = style;
  return this;
};

Penta.prototype.addStyle = function (style) {
  this.style = Object.assign(this.style, style);
  return this;
};

//
// Factory functions

Penta.prototype.createEdges = function (radius) {
  return [
    new Penta(this.p0, radius, this.angle),
    new Penta(this.p1, radius, this.angle),
    new Penta(this.p2, radius, this.angle),
    new Penta(this.p3, radius, this.angle),
    new Penta(this.p4, radius, this.angle)
  ];
};

Penta.prototype.getPs = function (radius) {
  return [this.p0, this.p1, this.p2, this.p3, this.p4];
}

Penta.prototype.createCore = function () {
  return this.clone({
    radius: this.radius * PM.gold_ * PM.gold_,
    angle: this.angle + PM.deg36
  })
};

Penta.prototype.createInner = function (style) {
  return new Penta(
    this.getCenter(),
    this.innerRadius,
    this.angle + PM.deg36,
    style);
};

Penta.prototype.createOuter = function (style) {
  return new Penta(
    this.getCenter(),
    this.outerRadius,
    this.angle + PM.deg36,
    style);
};

Penta.prototype.getEdgesAtPos = function (pos, radius) {
  let edgesAtPos = [];
  let edges = this.getPs().map((p, index) => {
    return {
      penta: this,
      index: index,
      pos: p,
      x: p[0],
      y: p[1]
    };
  });

  radius = radius || goldenContext.scale * 5;

  return edges.reduce((edgesAtPos, edge) => {
    if ((pos.x - radius) < edge.x && edge.x < (pos.x + radius)
      && (pos.y - radius) < edge.y && edge.y < (pos.y + radius)) {
      edgesAtPos.push(edge);
      edge.hitPos = {
        x: pos.x - edge.x,
        y: pos.y - edge.y
      };
    }
    return edgesAtPos;
  }, edgesAtPos);
};

Penta.prototype.saveInitialValues = function () {
  this.initialValues = {
    x: this.x,
    y: this.y,
    radius: this.radius,
    p0: [this.p0[0], this.p0[1]],
    p1: [this.p1[0], this.p1[1]],
    p2: [this.p2[0], this.p2[1]],
    p3: [this.p3[0], this.p3[1]],
    p4: [this.p4[0], this.p4[1]],
    angle: []
  }

  for (let i = 0; i < 5; i++) {
    this.initialValues.angle[i] = this.getEdgeAngle(i);
  }
}

Penta.prototype.moveEdge = function (index, pos) {
  let p = this.getEdge(index);
  p[0] = pos[0];
  p[1] = pos[1];
}

Penta.prototype.triangleMoveEdge = function (index, pos) {

  let indexNext = (index + 1) % 5;
  let indexPrev = (index - 1 + 5) % 5;
  let indexNextNext = (index + 2) % 5;
  let indexPrevPrev = (index - 2 + 5) % 5;

  let p = this.getEdge(index);
  let pNext = this.getEdge(indexNext);
  let pPrev = this.getEdge(indexPrev);
  let pNextNext = this.getEdge(indexNextNext);
  let pPrevPrev = this.getEdge(indexPrevPrev);

  this.movingEdges = [p, pNext, pPrev, [this.x, this.y]];

  p[0] = pos[0];
  p[1] = pos[1];

  let pNextMiddle = this.getMiddlePosition(index, indexNext, indexNextNext);
  let pPrevMiddle = this.getMiddlePosition(index, indexPrev, indexPrevPrev);

  pNext[0] = pNextMiddle[0];
  pNext[1] = pNextMiddle[1];
  pPrev[0] = pPrevMiddle[0];
  pPrev[1] = pPrevMiddle[1];

  // TODO? update all spots at the same position 
}

/**
 * Maintains the relation of the moving spot's adjacent angles.
 */
Penta.prototype.getMiddlePosition = function (indexMove, indexMid, index2) {

  let clockwise = (indexMove + 1) % 5 === indexMid;

  let initial = {
    anglePMove: this.initialValues.angle[indexMove],
    anglePMid: this.initialValues.angle[indexMid],
    angleP2: this.initialValues.angle[index2]
  };

  let anglePMove = this.getEdgeAngle(indexMove);
  let angleP2 = this.getEdgeAngle(index2);

  // Bring angles in ascending (clockwise) or descending order

  if (clockwise) { // anglePMid and angleP2 should be greater than anglePMove, anglePMove the *smallest* angle
    if (initial.anglePMid < initial.anglePMove) {
      initial.anglePMid += 2 * Math.PI;
    }
    if (initial.angleP2 < initial.anglePMove) {
      initial.angleP2 += 2 * Math.PI;
    }
    if (angleP2 < anglePMove) {
      angleP2 += 2 * Math.PI;
    }
  } else { // anglePMid and angleP2 should be smaller than anglePMove, anglePMove the *largest* angle
    if (initial.anglePMid > initial.anglePMove) {
      initial.anglePMid -= 2 * Math.PI;
    }
    if (initial.angleP2 > initial.anglePMove) {
      initial.angleP2 -= 2 * Math.PI;
    }
    if (angleP2 > anglePMove) {
      anglePMove += 2 * Math.PI;
    }
  }
  // console.log(`initial.anglePMove (${indexMove}) = ${PM.toDeg(initial.anglePMove)}`);
  // console.log(`initial.anglePMid (${indexMid}) = ${PM.toDeg(initial.anglePMid)}`);
  // console.log(`initial.angleP2 (${index2}) = ${PM.toDeg(initial.angleP2)}`);
  // console.log(`anglePMove (${indexMove}) = ${PM.toDeg(anglePMove)}`);
  // console.log(`angleP2 (${index2}) = ${PM.toDeg(angleP2)}`);

  // Calculate the initial angles' deltas' relation

  let dMoveP2 = initial.anglePMove - initial.angleP2;
  let dMidP2 = initial.anglePMid - initial.angleP2;
  let angleRelation = dMoveP2 / dMidP2;
  let angleMiddle = angleP2 + (anglePMove - angleP2) / angleRelation

  // maintain the angles' deltas' relation

  let initialRadiusMiddle = this.getPRadius(this.getEdgeInitial(indexMid));

  return [this.x + initialRadiusMiddle * Math.cos(angleMiddle), this.y + initialRadiusMiddle * Math.sin(angleMiddle)];
}

Penta.prototype.getEdge = function (index) {
  return this['p' + index];
};

Penta.prototype.getEdgeInitial = function (index) {
  return this.initialValues['p' + index];
};

Penta.prototype.getEdgeAngle = function (index) {
  return this.getPAngle(this.getEdge(index));
};

Penta.prototype.getPAngle = function (p) {
  let pFromCenter = [p[0] - this.x, p[1] - this.y];
  return PM.angle(pFromCenter);
};

Penta.prototype.getPRadius = function (p) {
  return PM.d(p, [this.x, this.y]);
};

Penta.prototype.createPentagonExtension = function (style) {
  // TODO
};

Penta.prototype.createPentagramExtension = function (style) {
  let offsetY = this.radius;
  if (this.angle / PM.deg72 > 2) {
    offsetY = -this.radius;
  }
  return new Penta(
    [this.x, this.y + offsetY],
    this.radius * PM.gold_,
    this.angle,
    style);
};

