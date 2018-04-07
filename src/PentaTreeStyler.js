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

PentaTreeStyler.prototype.clearStyles = function () {
  this.ctx.strokeStyle = "#000";
  this.ctx.fillStyle = "#000";
  this.ctx.lineWidth = 1;
  this.ctx.lineJoin = 'round';
  this.ctx.setLineDash([]);
};

PentaTreeStyler.prototype.getCascadingProperties = function (tree, propertyPathArray, propertyKeys) {
  let result = {};
  let node = tree;

  if (!node) return result;
  if (!propertyKeys) return result;

  this.assignProperties(node, result, propertyKeys);

  for (let i = 0; i < propertyPathArray.length; i++) {
    if (!node) break;
    let property = propertyPathArray[i];
    node = node[property];
    this.assignProperties(node, result, propertyKeys);
  }
  return result;
}

PentaTreeStyler.prototype.assignProperties = function (source, target, propertyKeys) {
  target = target || {};

  if (!source) return target;
  if (!propertyKeys) return target;

  return Object.keys(source).reduce((result, key) => {
    if (propertyKeys.indexOf(key) > -1) {
      result[key] = source[key]
    }
    return result;
  }, target);
}

PentaTreeStyler.prototype.assignStyleProperties = function (styleProps, penta) {
  if (!styleProps) return;
  
  Object.keys(styleProps).forEach(key => {
    if (key === 'fillStyle' && typeof styleProps[key] === 'function') {
      styleProps[key] = styleProps[key](penta);
    }
    this.ctx[key] = styleProps[key];
  });
}

/**
 * Traverses the specified style tree along the specified property path and
 * assigns all style properties to this.ctx in each step.
 */
PentaTreeStyler.prototype.applyTreeStyles = function (styleTree, propertyPath, penta) {
  if (!propertyPath) return;

  this.clearStyles();

  let styleProps = this.getCascadingProperties(styleTree, propertyPath, this.styleProperties);
  this.assignStyleProperties(styleProps, penta);

  // console.log("--- styles after applying propertyPath " + (propertyPath.join(".")));
  // this.logStyles();
}

PentaTreeStyler.prototype.logStyles = function () {
  this.styleProperties.forEach(prop => console.log(prop, "=", this.ctx[prop]));
};



/**
 * How to support wildcards in propertyPaths?
 * We need a preprocessor which searches all matching paths in the tree.
 * Then the found subtree should be rendered.
 */
PentaTreeStyler.prototype.expandWildcards = function (propertyPathArray) {
  // TODO
};
