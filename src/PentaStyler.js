/**
 * Idea for a flexible style configuration:
 *
 *  A style configuration contains properties of the CanvasRenderingContext2D
 *  They can either be specified on root level of the style object:
 *
 *    style = {
 *      strokeStyle: '#f04'
 *      fillStyle: '#ffa'
 *      lineWidth: 2
 *      lineJoin: 'round'
 *    }
 *
 *  or they can be assigned to certain parts of the golden Body shape:
 *
 *    style = {
 *      upper: {
 *        lineWidth: 3,
 *        inner: {
 *          fillStyle: '#245233',
 *        }
 *        outer: {}
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
 *  PentaStyler.applyTreeStyles() will assign all styles such that
 *  more specific styles will overwrite more general styles.
 */

function PentaStyler() {
  this.styleProperties = [
    'strokeStyle',
    'fillStyle',
    'lineWidth',
    'lineJoin'
  ];
  this.ctx = goldenContext.ctx;
}

/**
 * Returns a new object with those properties of
 * the specified 'style' argument with a name from the list above.
 */
PentaStyler.prototype.getStyleProps = function(style) {
  return Object.keys(style).reduce((memo, key) => {
    if (this.styleProperties.indexOf(key) > -1) {
      memo[key] = style[key]
    }
    return memo
  }, {});
}

PentaStyler.prototype.applyStyles = function(style, target) {
  target = target || this.ctx;
  if (style) {
    Object.assign(target, this.getStyleProps(style));
  }
  return target;
};

/**
 * Traverses the specified style tree along the specified property path and
 * assigns all style properties to this.ctx in each step.
 */
PentaStyler.prototype.applyTreeStyles = function(styleTree, propertyPath) {
  if (!propertyPath) return;

  this.clearStyles();
  propertyPath.concat(['sentinel']).reduce((style, property) => {
    if (!style) return {};
    Object.assign(this.ctx, this.getStyleProps(style));
    return style[property];
  }, styleTree);
}

PentaStyler.prototype.clearStyles = function() {
  this.ctx.strokeStyle = "#000";
  this.ctx.fillStyle = "#000";
  this.ctx.lineWidth = 1;
  this.ctx.lineJoin = 'round';
  this.ctx.setLineDash([]);
};
