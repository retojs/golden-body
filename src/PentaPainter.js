function PentaPainter() {
  this.ctx = goldenContext.ctx;

  // close-up
  //this.bgrImageUrl = 'https://dl.dropboxusercontent.com/s/3covvimcz5gfrui/golden-spots--physiological-model--square-1004px.png';
  // far-off
  //this.bgrImageUrl = 'https://dl.dropboxusercontent.com/s/3covvimcz5gfrui/golden-spots--physiological-model--square-1004px.png';
  // golden proportions
  this.bgrImageUrl = 'https://dl.dropboxusercontent.com/s/l6qxx5gssmovn8n/physiological-model--golden-proportion-format.png';
}

/**
 * Paints each penta of the specified golden body
 * and assigns the styles from the golden body styleTree
 * according to the property path of the penta using PentaStyler.applyTreeStyles()
 */
PentaPainter.prototype.paintGoldenBody = function(goldenBody) {

  goldenBody.createStyleTree();

  this.ctx.setLineDash(goldenContext.pentaStyle.dashes.none);

  /**
   * Here we are using a Promise to wait for the background image
   * to be loaded and painted on the canvas,
   * before we're painting the penta-model on top of it.
   */
  new PentaPainterOps().paintBgrImage(this.bgrImageUrl)
    .then(() => {
      this.paintSubtree(goldenBody, 'supers');
      this.paintSubtree(goldenBody, 'extremities');
      this.paintSubtree(goldenBody, 'inner');
      this.paintSubtree(goldenBody, 'outer');
      this.paintSubtree(goldenBody, 'middle');
      this.paintSubtree(goldenBody, 'cores');
      this.paintSubtreeSpots(goldenBody);
    });
};


PentaPainter.prototype.asArray = function(propertyPath) {
  if (!propertyPath) return [];
  if (Array.isArray(propertyPath)) return propertyPath;
  if (typeof propertyPath === 'string') {
    let pathArray = propertyPath.split('.');
    return Array.isArray(propertyPath) ? propertyPath : [propertyPath];
  } else {
    throw "PentaPainter.prototype.asArray(propertyPath): Cannot handle propertyPath of type " + (typeof propertyPath);
  }
};

PentaPainter.prototype.paintSubtree = function(goldenBody, propertyPath) {
  let propertyPathArray = this.asArray(propertyPath);
  this.paintSubtreePentas(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

PentaPainter.prototype.paintSubtreePentas = function(goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    let penta = subtree;
    let nextPath = propertyPathArray;
    let ops = new PentaPainterOps();

    new PentaStyler().applyTreeStyles(goldenBody.styleTree, nextPath);

    ops.circle(penta);
    ops.pentagon(penta);
    ops.pentagram(penta);
    if (nextPath.indexOf('extremities') > -1) {
      this.ctx.setLineDash(goldenContext.pentaStyle.dashes.fine);
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
      this.paintSubtreePentas(goldenBody, subtree[key], propertyPathArray.concat([key]));
    });
  }
};

PentaPainter.prototype.paintSubtreeSpots = function(goldenBody, subtree, styles) {
  subtree = subtree || goldenBody.pentaTree;
  styles = styles || {};

  if (isPenta(subtree)) {
    if (subtree.goldenSpots) {
      this.paintPentaSpots(subtree, styles);
    }
  } else {
    new PentaStyler().applyStyles(subtree.styles, styles);
    Object.keys(subtree).forEach(key => {
      this.paintSubtreeSpots(goldenBody, subtree[key], styles);
    });
  }
}

PentaPainter.prototype.paintPentaSpots = function(penta, styles) {
  if (penta.goldenSpots) {
    let spots = penta.createEdges(penta.goldenSpots.radius);
    let options = penta.goldenSpots.options;
    let ops = new PentaPainterOps();

    styles = Object.assign({}, styles, penta.goldenSpots.styles);

    spots.forEach((spot) => {
      if (options.fillCircle) {
        ops.fillCircle(spot, styles);
      }
      if (options.drawCircle) {
        ops.circle(spot, styles);
      }
      if (options.fillStar) {
        ops.fillPentagram(spot, styles)
      }
      if (options.drawStar) {
        ops.star(spot, styles)
      }
    });
  }
}
