function PentaPainter() {
  this.bgrImageUrl = 'assets/physiological-model--golden-proportion-format.png';  // image format has golden proportions
  this.bgrImageWidth = 900;
  this.bgrImageHeight = 1456;
  goldenContext.bgrImageProportion = this.bgrImageHeight / this.bgrImageWidth;

  // close-up
  //this.bgrImageUrl = 'assets/golden-spots--physiological-model--square-1004px.png';

  // far-off
  //this.bgrImageUrl = 'assets/golden-spots--physiological-model--square-1004px.png';
}

/**
 * Paints each Penta of the specified Golden Body.
 * The applicable canvas styles are collected from the Golden Body's style tree (cascading).
 */
PentaPainter.prototype.paintGoldenBody = function (goldenBody) {
  let ctx = goldenContext.ctx;

  createStyleTree(goldenBody);

  // ctx.scale(goldenContext.zoom || 1, goldenContext.zoom || 1);
  // ctx.translate(goldenContext.canvas.width, 2.0);

  ctx.setLineDash(goldenContext.pentaStyles.dashes.none);

  /**
   * Here we are using a Promise to wait for the background image
   * to be loaded and painted on the canvas,
   * before we're painting the penta-model on top of it.
   */
  return new PentaPainterOps().paintBgrImage(this.bgrImageUrl)
    .then(() => {
      this.paintSubtreePentas(goldenBody, 'supers.outer');
      this.paintSubtreePentas(goldenBody, 'supers.middle');

      this.paintSubtreePentas(goldenBody, 'inner');
      this.paintSubtreePentas(goldenBody, 'outer');
      this.paintSubtreePentas(goldenBody, 'middle');

      // this.paintSubtreePentas(goldenBody, 'extremities');
      // this.paintSubtreePentas(goldenBody, 'outerExtremities');   
      this.paintSubtreePentas(goldenBody, 'cores');

      this.paintSubtreeSpots(goldenBody, 'cores');

      this.paintSubtreeSpots(goldenBody, 'middle');
      this.paintSubtreeSpots(goldenBody, 'outer');
      this.paintSubtreeSpots(goldenBody, 'inner');

      // this.paintSubtreeSpots(goldenBody, 'cores');

    });
};

PentaPainter.prototype.asArray = function (propertyPath) {
  if (!propertyPath) return [];
  if (Array.isArray(propertyPath)) return propertyPath;
  if (typeof propertyPath === 'string') {
    let pathArray = propertyPath.split('.');
    return Array.isArray(pathArray) ? pathArray : [pathArray];
  } else {
    throw "PentaPainter.prototype.asArray(propertyPath): Cannot handle propertyPath of type " + (typeof propertyPath);
  }
};

//
// paint Pentas

PentaPainter.prototype.paintSubtreePentas = function (goldenBody, propertyPath) {
  let propertyPathArray = this.asArray(propertyPath);
  this.paintSubtreePentasRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

PentaPainter.prototype.paintSubtreePentasRecursively = function (goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    this.paintPenta(subtree, goldenBody.styleTree, propertyPathArray);
  } else {
    Object.keys(subtree).forEach(key => {
      this.paintSubtreePentasRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
    });
  }
};

PentaPainter.prototype.paintPenta = function (penta, styleTree, propertyPathArray) {
  let ops = new PentaPainterOps();
  let stylesPerOp = ops.getStylesPerOp(styleTree, propertyPathArray);
  ops.styler.applyTreeStyles(styleTree, propertyPathArray, penta);
  ops.opsList.forEach(op => {
    if (typeof stylesPerOp[op] === 'boolean') {
      if (stylesPerOp[op]) {
        ops[op](penta);
      }
    } else if (stylesPerOp[op]) {
      ops[op](penta, stylesPerOp[op]);
    }
  });
};

//
// paint Golden Spots

PentaPainter.prototype.paintSubtreeSpots = function (goldenBody, propertyPath) {
  let propertyPathArray = this.asArray(propertyPath);
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
      this.paintSubtreeSpotsRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
    });
  }
}

/**
 * Creates a Penta for each Golden Spot by calling penta.createEdges(radius)
 * and paints these Pentas as stars with the styles defined in penta.goldenSpots.options.
 */
PentaPainter.prototype.paintPentaSpots = function (goldenBody, penta, propertyPathArray) {
  let ops = new PentaPainterOps();
  let stylesPerOp = ops.getStylesPerOp(goldenBody.styleTree.spots, propertyPathArray);
  let radius = ops.styler.getCascadingProperties(goldenBody.styleTree.spots, propertyPathArray, ['radius']).radius;
  let spots = penta.createEdges(radius);
  spots.forEach((spot) => {
    ops.opsList.forEach(op => {
      if (typeof stylesPerOp[op] === 'boolean') {
        if (stylesPerOp[op]) {
          ops[op](spot);
        }
      } else if (stylesPerOp[op]) {
        ops[op](spot, stylesPerOp[op]);
      }
    });
  });
}

