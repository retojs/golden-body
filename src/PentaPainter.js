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
      //this.paintSubtreePentas(goldenBody, 'supers');
      //  this.paintSubtreePentas(goldenBody, 'extremities');
      this.paintSubtreePentas(goldenBody, 'inner');
      this.paintSubtreePentas(goldenBody, 'outer');
      this.paintSubtreePentas(goldenBody, 'middle');
      this.paintSubtreePentas(goldenBody, 'cores');
      this.paintSubtreeSpots(goldenBody, 'inner.upper');
      this.paintSubtreeSpots(goldenBody, 'cores.outer.lower');
      //  this.paintSubtreeSpots(goldenBody, 'outer');
      //  this.paintSubtreeSpots(goldenBody, 'cores');
    });
};

PentaPainter.prototype.asArray = function(propertyPath) {
  if (!propertyPath) return [];
  if (Array.isArray(propertyPath)) return propertyPath;
  if (typeof propertyPath === 'string') {
    let pathArray = propertyPath.split('.');
    return Array.isArray(pathArray) ? pathArray : [pathArray];
  } else {
    throw "PentaPainter.prototype.asArray(propertyPath): Cannot handle propertyPath of type " + (typeof propertyPath);
  }
};

PentaPainter.prototype.paintSubtreePentas = function(goldenBody, propertyPath) {
  let propertyPathArray = this.asArray(propertyPath);
  this.paintSubtreeNodePentas(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

PentaPainter.prototype.paintSubtreeNodePentas = function(goldenBody, subtree, propertyPathArray) {
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
      this.paintSubtreeNodePentas(goldenBody, subtree[key], propertyPathArray.concat([key]));
    });
  }
};

PentaPainter.prototype.paintSubtreeSpots = function(goldenBody, propertyPath) {
  let propertyPathArray = this.asArray(propertyPath);
  this.paintSubtreeNodeSpots(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

PentaPainter.prototype.paintSubtreeNodeSpots = function(goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    if (subtree.goldenSpots) {
      new PentaStyler().applyTreeStyles(goldenBody.styleTree, ["spots"].concat(propertyPathArray));
      this.paintPentaSpots(subtree);
    }
  } else {
    Object.keys(subtree).forEach(key => {
      this.paintSubtreeNodeSpots(goldenBody, subtree[key], propertyPathArray.concat([key]));
    });
  }
}

PentaPainter.prototype.paintPentaSpots = function(penta) {
  if (penta.goldenSpots) {
    let ops = new PentaPainterOps();
    let spots = penta.createEdges(penta.goldenSpots.radius);
    spots.forEach((spot) => {
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
