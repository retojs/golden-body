/**
 *  # Cascading Style Configuration
 *
 *  A style configuration object contains properties of the CanvasRenderingContext2D.
 *
 *    style = {
 *      strokeStyle: '#f04'
 *      fillStyle: '#ffa'
 *      lineWidth: 2
 *      lineJoin: 'round'
 *    }
 *
 *  These style objects can be assigned to any path of the Golden Body Penta tree.
 *
 *    {
 *      upper: {
 *        lineWidth: 3,
 *        inner: {
 *          fillStyle: '#245233',
 *        }
 *        outer: {
 *          fillStyle: '#253434',
 *        }
 *      },
 *      lower: {
 *        inner: { ... }
 *        outer: { ... }
 *      }
 *      middle: { ... }
 *    }
 *
 *  When painting a node of the Penta tree PentaTreeStyler.applyTreeStyles() will assign all styles
 *  in the node's path in a cascading manner.
 *  I.e. more specific styles will overwrite more general styles.
 */

function PentaTreeStyler() {
  this.styleProperties = [
    'strokeStyle',
    'fillStyle',
    'lineWidth',
    'lineJoin'
  ];
  this.ctx = goldenContext.ctx;
}

/**
 * Returns a new object with those properties of the specified 'style' argument
 * with a name from the list of style properties above.
 */
PentaTreeStyler.prototype.getStyleProps = function (style) {
  return Object.keys(style).reduce((memo, key) => {
    if (this.styleProperties.indexOf(key) > -1) {
      memo[key] = style[key]
    }
    return memo
  }, {});
}

PentaTreeStyler.prototype.applyStyles = function (penta, style, target) {
  target = target || this.ctx;
  if (style) {
    this.applyStyleProps(style, penta);
  }
  return target;
};

/**
 * Traverses the specified style tree along the specified property path and
 * assigns all style properties to this.ctx in each step.
 */
PentaTreeStyler.prototype.applyTreeStyles = function (styleTree, propertyPath, penta) {
  if (!propertyPath) return;

  this.clearStyles();
  propertyPath.concat(['sentinel']).reduce((style, property) => {
    if (!style) return {};
    this.applyStyleProps(style, penta);
    return style[property];
  }, styleTree);

  console.log("--- styles after applying propertyPath " + (propertyPath.join(".")));
  this.logStyles();
}

PentaTreeStyler.prototype.applyStyleProps = function (style, penta) {
  let styleProps = this.getStyleProps(style)
  Object.keys(styleProps).forEach(key => {
    if (key === 'fillStyle' && typeof styleProps[key] === 'function') {
      styleProps[key] = styleProps[key](penta);
    }
    this.ctx[key] = styleProps[key];
  });
}

/**
 * How to support wildcards in propertyPaths?
 * We need a preprocessor which searches all matching paths in the tree.
 * Then the found subtree should be rendered.
 */
PentaTreeStyler.prototype.expandWildcards = function (propertyPathArray) {
  // TODO
}

PentaTreeStyler.prototype.clearStyles = function () {
  this.ctx.strokeStyle = "#000";
  this.ctx.fillStyle = "#000";
  this.ctx.lineWidth = 1;
  this.ctx.lineJoin = 'round';
  this.ctx.setLineDash([]);
};

PentaTreeStyler.prototype.logStyles = function () {
  this.styleProperties.forEach(prop => console.log(prop, "=", this.ctx[prop]));
}
