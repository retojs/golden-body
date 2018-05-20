function PentaPainter() {

  // close-up
  //this.bgrImageUrl = 'assets/golden-spots--physiological-model--square-1004px.png';

  // far-off
  //this.bgrImageUrl = 'assets/golden-spots--physiological-model--square-1004px.png';

  this.bgrImageUrl = 'assets/physiological-model--golden-proportion-format.png';  // image format has golden proportions
  this.bgrImageWidth = 900;
  this.bgrImageHeight = 1456;
  goldenContext.bgrImageProportion = this.bgrImageHeight / this.bgrImageWidth;

  this.ops = new PentaPainterOps();
}

/**
 * Paints each Penta of the specified Golden Body.
 * The applicable canvas styles are collected from the Golden Body's style tree (cascading).
 */
PentaPainter.prototype.paintGoldenBody = function (goldenBody) {
  let ctx = goldenContext.ctx;

  createStyleTree(goldenBody);

  ctx.restore();
  ctx.resetTransform();
  ctx.scale(goldenContext.zoom || 1, goldenContext.zoom || 1);
  ctx.translate(goldenContext.translate.x, goldenContext.translate.y);
  ctx.setLineDash(goldenContext.pentaStyles.dashes.none);

  /**
   * Here we are using a Promise to wait for the background image
   * to be loaded and painted on the canvas,
   * before we're painting the penta-model on top of it.
   */
  return this.ops.paintBgrImage(this.bgrImageUrl)
    .then(() => {
      let paintOrderLines = document.getElementById('golden-body-paint-order').value.split('\n');
      paintOrderLines.forEach(line => {
        line = line.trim();
        if (line) {
          if (line.indexOf('spots') === 0) {
            this.paintSubtreeSpots(goldenBody, line.substr('spots.'.length));
          } else {
            this.paintSubtreePentas(goldenBody, line);
          }
        }
      });
      //console.log("painter: goldenContext.hitSpots=", goldenContext.hitSpots);
      this.paintHitSpots(goldenContext.hitSpots, {
        fillStyle: "rgba(255, 0, 255, 0.2)"
      });
      //console.log("painter: goldenContext.hoverSpots=", goldenContext.hoverSpots);
      this.paintHitSpots(goldenContext.hoverSpots, {
        fillStyle: "rgba(255, 0, 255, 0.1)"
      });
    });
};

PentaPainter.prototype.paintHitSpots = function (hitSpots, style) {
  hitSpots.forEach(spot => this.ops.fillSimpleCircle(
    {
      x: spot.pos[0],
      y: spot.pos[1],
      radius: 36
    },
    style
  ));
}

PentaPainter.prototype.pathString2Array = function (propertyPath) {
  if (!propertyPath) return [];
  if (Array.isArray(propertyPath)) return propertyPath;
  if (typeof propertyPath === 'string') {
    let pathArray = propertyPath.split('.');
    return Array.isArray(pathArray) ? pathArray : [pathArray];
  } else {
    throw "PentaPainter.prototype.pathString2Array(propertyPath): Cannot handle propertyPath of type " + (typeof propertyPath);
  }
};

//
// paint Pentas

PentaPainter.prototype.paintSubtreePentas = function (goldenBody, propertyPath) {
  let propertyPathArray = this.pathString2Array(propertyPath);
  this.paintSubtreePentasRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

PentaPainter.prototype.paintSubtreePentasRecursively = function (goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    this.paintPenta(subtree, goldenBody.styleTree, propertyPathArray);
  } else {
    Object.keys(subtree).forEach(key => {
      if (subtree[key]) {
        this.paintSubtreePentasRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
      }
    });
  }
};

PentaPainter.prototype.paintPenta = function (penta, styleTree, propertyPathArray) {
  let stylesPerOp = this.ops.getStylesPerOp(styleTree, propertyPathArray);
  this.ops.styler.applyTreeStyles(styleTree, propertyPathArray, penta);
  this.ops.opsList.forEach(op => {
    if (typeof stylesPerOp[op] === 'boolean') {
      if (stylesPerOp[op]) {
        this.ops[op](penta);
      }
    } else if (stylesPerOp[op]) {
      this.ops[op](penta, stylesPerOp[op]);
    }
  });
  if (penta.movingEdges) {
    penta.movingEdges.forEach(edge => this.ops.fillSimpleCircle({ x: edge[0], y: edge[1], radius: 20, style: { fillStyle: "#00f" } }));
    if (penta.movingEdges[3]) {
      let edge = penta.movingEdges[3];
      this.ops.fillSimpleCircle({ x: edge[0], y: edge[1], radius: 20, style: { fillStyle: "#0f0" } });
    }  
  }
};

//
// paint Golden Spots

PentaPainter.prototype.paintSubtreeSpots = function (goldenBody, propertyPath) {
  let propertyPathArray = this.pathString2Array(propertyPath);
  this.paintSubtreeSpotsRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

/**
 * Paints the Golden Spots of each Penta in the Penta Tree by calling this.paintPentaSpots(penta)
 * after having applied all the corresponding styles from the Golden Body's styles tree.
 */
PentaPainter.prototype.paintSubtreeSpotsRecursively = function (goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    this.paintPentaSpots(goldenBody, subtree, propertyPathArray);
  } else {
    Object.keys(subtree).forEach(key => {
      if (subtree[key]) {
        this.paintSubtreeSpotsRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
      }
    });
  }
}

/**
 * Creates a Penta for each Golden Spot by calling penta.createEdges(radius)
 * and paints these Pentas as stars with the styles defined in penta.goldenSpots.options.
 */
PentaPainter.prototype.paintPentaSpots = function (goldenBody, penta, propertyPathArray) {
  let stylesPerOp = this.ops.getStylesPerOp(goldenBody.styleTree.spots, propertyPathArray);
  let radius = this.ops.styler.getCascadingProperties(goldenBody.styleTree.spots, propertyPathArray, ['radius']).radius;
  let spots = penta.createEdges(radius);
  spots.forEach((spot) => {
    this.ops.opsList.forEach(op => {
      if (typeof stylesPerOp[op] === 'boolean') {
        if (stylesPerOp[op]) {
          this.ops[op](spot);
        }
      } else if (stylesPerOp[op]) {
        this.ops[op](spot, stylesPerOp[op]);
      }
    });
  });
}

