function PentaPainter() {
  this.ctx = goldenContext.ctx;
  this.pentaTreeStyler = new PentaTreeStyler();

  // golden proportions
  this.bgrImageUrl = 'https://dl.dropboxusercontent.com/s/l6qxx5gssmovn8n/physiological-model--golden-proportion-format.png';

  // close-up
  //this.bgrImageUrl = 'https://dl.dropboxusercontent.com/s/3covvimcz5gfrui/golden-spots--physiological-model--square-1004px.png';

  // far-off
  //this.bgrImageUrl = 'https://dl.dropboxusercontent.com/s/3covvimcz5gfrui/golden-spots--physiological-model--square-1004px.png';
}

/**
 * Paints each Penta of the specified Golden Body.
 * The applicable canvas styles are collected from the Golden Body's style tree (cascading).
 */
PentaPainter.prototype.paintGoldenBody = function (goldenBody) {

  createStyleTree(goldenBody);

  this.ctx.setLineDash(goldenContext.pentaStyle.dashes.none);

  /**
   * Here we are using a Promise to wait for the background image
   * to be loaded and painted on the canvas,
   * before we're painting the penta-model on top of it.
   */
  new PentaPainterOps().paintBgrImage(this.bgrImageUrl)
    .then(() => {
      this.paintSubtreePentas(goldenBody, 'supers');
      // this.paintSubtreePentas(goldenBody, 'extremities');
      this.paintSubtreePentas(goldenBody, 'inner');
      this.paintSubtreePentas(goldenBody, 'outer');
      this.paintSubtreePentas(goldenBody, 'middle.upper');
      this.paintSubtreePentas(goldenBody, 'outerExtremities');

      // this.paintSubtreePentas(goldenBody, 'cores');

      this.paintSubtreeSpots(goldenBody, 'outer');
      this.paintSubtreeSpots(goldenBody, 'inner.upper');
      this.paintSubtreeSpots(goldenBody, 'inner.lower');
      this.paintSubtreeSpots(goldenBody, 'middle');

      // this.paintSubtreeSpots(goldenBody, 'cores');
      // this.paintSubtreeSpots(goldenBody, 'cores.outer.lower');
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

PentaPainter.prototype.paintSubtreePentas = function (goldenBody, propertyPath) {
  let propertyPathArray = this.asArray(propertyPath);
  this.paintSubtreePentasRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

PentaPainter.prototype.paintSubtreePentasRecursively = function (goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    let penta = subtree;
    let nextPath = propertyPathArray;
    let ops = new PentaPainterOps();

    this.pentaTreeStyler.applyTreeStyles(goldenBody.styleTree, nextPath, penta);

    ops.circle(penta);
    ops.pentagon(penta);
    ops.pentagram(penta);
    if (nextPath.indexOf('extremities') > -1) {
      this.ctx.setLineDash(goldenContext.pentaStyle.dashes.fine);
    }
    if (nextPath.indexOf('outerExtremities') > -1) {
      this.ctx.setLineDash(goldenContext.pentaStyle.dashes.fine);
      if (nextPath.indexOf('shoulder') > -1) {
        ops.fillPentagram(penta);
      }
      if (nextPath.indexOf('upperArm') > -1) {
        ops.fillPentagram(penta);
      }
      if (nextPath.indexOf('hand') > -1) {
        ops.fillPentagon(penta);
        ops.fillPentagram(penta);
      }
      if (nextPath.indexOf('lowerHand') > -1) {
        ops.fillPentagon(penta);
      }
    }

    if (nextPath.indexOf('supers') > -1) {
      ops.fillCircle(penta);
      if (nextPath.indexOf('upper') > -1) {
        ops.fillPentagon(penta);
      }
      if (nextPath.indexOf('lower') > -1) {
        ops.fillPentagram(penta);
      }
    }
    if (nextPath.indexOf('outer') > -1) {
      ops.fillPentagram(penta);
    }
    if (nextPath.indexOf('inner') > -1) {
      ops.fillPentagon(penta);
    }
    if (nextPath.indexOf('middle') > -1 || nextPath.indexOf('lowerMiddle') > -1) {
      ops.fillPentagon(penta);
    }
  } else {
    Object.keys(subtree).forEach(key => {
      this.paintSubtreePentasRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
    });
  }
};

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
    if (subtree.goldenSpots) {
      this.paintPentaSpots(subtree, goldenBody.styleTree, ["spots"].concat(propertyPathArray));
    }
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
PentaPainter.prototype.paintPentaSpots = function (penta, styleTree, propertyPath) {
  if (penta.goldenSpots) {
    let ops = new PentaPainterOps();
    let spots = penta.createEdges(penta.goldenSpots.radius);
    spots.forEach((spot) => {
      this.pentaTreeStyler.applyTreeStyles(styleTree, propertyPath, spot);
      let options = penta.goldenSpots.getSpotOptions(spot);
      if (options.fillCircle) {
        ops.fillCircle(spot, options.fillCircle);
      }
      if (options.drawCircle) {
        ops.circle(spot, options.drawCircle);
      }
      if (options.fillStar) {
        ops.fillPentagram(spot, options.fillStar)
      }
      if (options.drawStar) {
        ops.star(spot, options.drawStar)
      }
    });
  }
}
