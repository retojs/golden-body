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
  console.log('paintGoldenBody', new Date());

  let ctx = goldenContext.ctx;

  // ctx.setLineDash(goldenContext.pentaStyles.dashes.none);
  // ctx.lineWidth = 1.75;
  ctx.lineJoin = 'round';

  goldenContext.visiblePentas = [];
  goldenContext.visibleSpots = [];

  createStyleTree(goldenBody);
  // createDiamondStyleTree(goldenBody);

  /**
   * Here we are using a Promise to wait for the background image
   * to be loaded and painted on the canvas,
   * before we're painting the penta-model on top of it.
   */
  return this.ops.paintBgrImage(this.bgrImageUrl, ctx)
    .then(() => {
      goldenContext.paintOrderLines.forEach(line => {
        line = line.trim();
        if (line) {
          if (goldenContext.animationStartTime && goldenContext.animateTreePath.some(path => line.indexOf(path) === 0)) {
            return; // don't paint animated elements here if animation is running
          }
          if (line.indexOf('/') === 0) {
            return;
          }
          if (line.indexOf('spots') === 0) {
            this.paintSpots(goldenBody, line);
          } else if (line.indexOf('diamonds') === 0) {
            this.paintDiamonds(goldenBody, line);
          } else {
            this.paintPentaTreePath(goldenBody, line);
          }
        }
      });
      //console.log('painter: goldenContext.hitSpots=', goldenContext.hitSpots);
      // this.paintHitSpots(goldenContext.hitSpots, {
      //   fillStyle: 'rgba(255, 0, 255, 0.2)'
      // });
      //console.log('painter: goldenContext.hoverSpots=', goldenContext.hoverSpots);
      // this.paintHitSpots(goldenContext.hoverSpots, {
      //   fillStyle: 'rgba(255, 0, 255, 0.1)'
      // });
    })
    .then(() => {
      this.repaint(goldenContext.offscreenCanvas, true);
    });
};

PentaPainter.prototype.repaint = function (offscreenCanvas, clearCanvas) {
  const ctx = goldenContext.canvas.getContext('2d');
  if (clearCanvas) {
    ctx.fillStyle = goldenContext.backgroundColor;
    ctx.fillRect(0, 0, goldenContext.canvasSize.width, goldenContext.canvasSize.height);
  }
  ctx.drawImage(
    offscreenCanvas,
    goldenContext.translate.x * goldenContext.zoom,
    goldenContext.translate.y * goldenContext.zoom,
    goldenContext.canvasSize.width * goldenContext.zoom,
    goldenContext.canvasSize.height * goldenContext.zoom,
  );

  if (goldenContext.doPaintBitmap && !goldenContext.changing) {
    console.log('goldenContext.doPaintBitmap=', goldenContext.doPaintBitmap);
    this.paintBitmap();
  }
};

PentaPainter.prototype.lastPaintBitmap = -1;

PentaPainter.prototype.paintBitmap = function () {
  this.lastPaintBitmap = Date.now();
  let throttleMillis = 1200;

  setTimeout(() => {
    if (getDeltaTime(this.lastPaintBitmap) >= throttleMillis && !goldenContext.changing) {
      let canvasImage = document.getElementById('canvas-image');
      canvasImage.src = 'assets/clock.png';
      goldenContext.canvas.className = 'clock';
      setTimeout(() => {
        const data = goldenContext.canvas.toDataURL('image/png');
        canvasImage.src = data;
        canvasImage.title = 'Right-click to download the current image';
        goldenContext.canvas.className = '';
      }, 30)
    }
  }, throttleMillis);

  function getDeltaTime(refTime) {
    return Date.now() - refTime;
  }
};

PentaPainter.prototype.paintAnimation = function (pentaTree, styleTree, paintOrderArray) {
  let ctx = goldenContext.ctx = goldenContext.animationCanvas.getContext('2d');

  ctx.setLineDash(goldenContext.pentaStyles.dashes.none);
  ctx.lineWidth = 4 * 1.75;
  ctx.lineJoin = 'round';
  ctx.clearRect(0, 0, goldenContext.canvasSize.width, goldenContext.canvasSize.height);

  paintOrderArray.forEach(line => {
    let goldenBody = { pentaTree, styleTree };
    let propertyPathArray = this.pathString2Array(line);
    if (line.indexOf('spots') === 0) {
      propertyPathArray = propertyPathArray.slice(1);
      this.paintSpotsRecursively(goldenBody, goldenContext.goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
    } else {
      this.paintPentaSubtreeRecursively(goldenBody, goldenContext.goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
    }
  });

  this.repaint(goldenContext.animationCanvas);

  goldenContext.ctx = goldenContext.offscreenCanvas.getContext('2d');
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
    throw 'PentaPainter.prototype.pathString2Array(propertyPath): Cannot handle propertyPath of type ' + (typeof propertyPath);
  }
};

//
// paint Pentas

PentaPainter.prototype.paintPentaTreePath = function (goldenBody, propertyPath) {
  let propertyPathArray = this.pathString2Array(propertyPath);
  this.paintPentaSubtreeRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

PentaPainter.prototype.paintPentaSubtreeRecursively = function (goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    this.paintPenta(subtree, goldenBody.styleTree, propertyPathArray);
  } else {
    Object.keys(subtree).forEach(key => {
      if (subtree[key]) {
        this.paintPentaSubtreeRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
      }
    });
  }
};

PentaPainter.prototype.paintPenta = function (penta, styleTree, propertyPathArray) {
  goldenContext.visiblePentas.push(penta);

  let stylesPerOp = this.ops.getStylesPerOp(styleTree, propertyPathArray);
  this.ops.styler.applyTreeStyles(styleTree, propertyPathArray, penta);
  this.ops.opsList.forEach(op => {
    if (goldenContext.animationStartTime) {
      stylesPerOp[op] = goldenContext.animatePentaStyles(stylesPerOp[op], op, propertyPathArray);
    }
    if (stylesPerOp[op]) {
      this.ops[op](penta, stylesPerOp[op]);
    }
  });
  // if (penta.movingEdges && penta.movingEdges.length > 0) {
  //   penta.movingEdges.forEach(edge => this.ops.fillSimpleCircle({ x: edge[0], y: edge[1], radius: 20, style: { fillStyle: '#00f' } }));
  //   this.ops.fillSimpleCircle({ x: penta.x, y: penta.y, radius: 20, style: { fillStyle: '#0f0' } });
  // }
};

//
// paint Golden Spots

PentaPainter.prototype.paintSpots = function (goldenBody, propertyPath) {
  let propertyPathArray = this.pathString2Array(propertyPath).slice(1);
  this.paintSpotsRecursively(goldenBody, goldenBody.getPentaSubtree(propertyPathArray), propertyPathArray);
}

/**
 * Paints the Golden Spots of each Penta in the Penta Tree by calling this.paintPentaSpots(penta)
 * after having applied all the corresponding styles from the Golden Body's styles tree.
 */
PentaPainter.prototype.paintSpotsRecursively = function (goldenBody, subtree, propertyPathArray) {
  subtree = subtree || goldenBody.pentaTree;
  propertyPathArray = propertyPathArray || [];

  if (isPenta(subtree)) {
    this.paintPentaSpots(goldenBody, subtree, propertyPathArray);
  } else {
    Object.keys(subtree).forEach(key => {
      if (subtree[key]) {
        this.paintSpotsRecursively(goldenBody, subtree[key], propertyPathArray.concat([key]));
      }
    });
  }
}

/**
 * Creates a Penta for each Golden Spot by calling penta.createEdges(radius)
 * and paints these Pentas as stars with the styles defined in penta.goldenSpots.options.
 */
PentaPainter.prototype.paintPentaSpots = function (goldenBody, penta, propertyPathArray) {
  goldenContext.visibleSpots.push(penta);

  let radius = this.ops.styler.getCascadingProperties(goldenBody.styleTree.spots, propertyPathArray, ['radius']).radius;
  let spots = penta.createEdges(radius);
  let stylesPerOp = this.ops.getStylesPerOp(goldenBody.styleTree.spots, propertyPathArray);
  this.ops.styler.applyTreeStyles(goldenBody.styleTree.spots, propertyPathArray, penta);

  spots.forEach((spot) => {
    if (goldenContext.animationStartTime) {
      goldenContext.animateSpot(spot, propertyPathArray);
    }
    this.ops.opsList.forEach(op => {
      if (stylesPerOp[op]) {
        this.ops[op](spot, stylesPerOp[op]);
      }
    });
  });
}

PentaPainter.prototype.paintDiamonds = function (goldenBody, propertyPath) {
  let propertyPathArray = this.pathString2Array(propertyPath);

  let doFill = true;
  if (propertyPathArray[1] === 'large') {
    let style = { fillStyle: 'rgba(255, 0, 100, 0.5)', strokeStyle: '#c00' };
    this.ops.drawLargeInnerDiamond(goldenBody.pentaTree, style);
  }
  if (propertyPathArray[1] === 'small') {
    let style = { fillStyle: 'rgba(255, 0, 150, 0.8)', strokeStyle: '#c00' };
    this.ops.drawSmallInnerDiamond(goldenBody.pentaTree, style);
  }
}