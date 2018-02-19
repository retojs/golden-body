/**
 * @param center: The upper large penta's center's position
 * @param radius: The upper large penta's radius
 * @param angle:  All penta's default angle
 * @param style: style configuration
 */
function GoldenBody(center, radius, angle, style) {

  this.center = center;
  this.radius = radius;
  this.angle = angle || 0;
  this.style = style;

  this.createPentaTree();

  document.getElementById('penta-tree').innerHTML = this.toString();
}

GoldenBody.prototype.toString = function() {
  return "GoldenBody.pentaTree = " +
    JSON.stringify(this.pentaTree, (key, value) => {
      if (isPenta(value)) {
        return value.toString();
      }
      return value;
    }, 2) +
    "\n\n" +
    "GoldenBody.styleTree = " +
    JSON.stringify(this.styleTree, null, 2);
}

GoldenBody.prototype.createPentaTree = function() {

  let outerUpper = new Penta(this.center, this.radius, this.angle, this.style);

  let innerUpper = outerUpper.clone({
    radius: outerUpper.innerRadius,
    angle: outerUpper.angle + PM.deg36
  });

  let middle = innerUpper.clone({
    radius: innerUpper.radius * PM.gold_
  });

  let outerLower = middle.clone({
    radius: middle.outerRadius
  })
  outerLower.move([0, outerUpper.radius + outerLower.radius]);

  let innerLower = middle.clone({
    angle: middle.angle + PM.deg180
  });
  innerLower.move([0, outerUpper.radius + outerLower.radius]);

  let lowerMiddle = middle.clone({
    radius: middle.radius * PM.gold_,
    angle: middle.angle + PM.deg36
  });
  lowerMiddle.move([0, outerUpper.radius + outerLower.radius - innerLower.radius]);

  middle.move([0, innerUpper.radius]);

  let upperSuper = outerUpper.clone({
    radius: outerUpper.radius * PM.gold * PM.gold,
    angle: outerUpper.angle + PM.deg180
  });

  let lowerSuper = outerLower.clone({
    radius: outerLower.radius * PM.gold * PM.gold,
    angle: outerLower.angle + PM.deg180
  });

  function rotateBy(center, penta, angle) {
    return penta.clone().rotate(angle, center.getCenter())
  }

  function createExtremities(center, angle, extInner, extOuter) {
    return {
      middle: {
        upper: {
          left: rotateBy(center, middle, angle),
          right: rotateBy(center, middle, -angle)
        },
        lower: {
          left: rotateBy(center, lowerMiddle, angle),
          right: rotateBy(center, lowerMiddle, -angle)
        }
      },

      inner: {
        lower: {
          left: rotateBy(center, extInner, angle),
          right: rotateBy(center, extInner, -angle)
        }
      },
      outer: {
        lower: {
          left: rotateBy(center, extOuter, angle),
          right: rotateBy(center, extOuter, -angle)
        }
      }
    };
  }

  this.pentaTree = {

    middle: {
      upper: middle,
      lower: lowerMiddle
    },

    outer: {
      upper: outerUpper,
      lower: outerLower
    },
    inner: {
      upper: innerUpper,
      lower: innerLower
    },

    cores: {
      middle: {
        upper: middle.createCore(),
        lower: lowerMiddle.createCore()
      },

      outer: {
        upper: outerUpper.createCore(),
        lower: outerLower.createCore()
      },
      inner: {
        upper: innerUpper.createCore(),
        lower: innerLower.createCore()
      }
    },

    supers: {
      upper: upperSuper,
      lower: lowerSuper
    },

    extremities: {
      upper: createExtremities(innerUpper, PM.deg72, innerLower, outerLower),
      lower: createExtremities(innerLower, 2 * PM.deg72, innerUpper, outerUpper)
    }
  }

  console.log('pentaTree');
  console.log(this.pentaTree);
}

/**
 * Creates the same structure as pentaTree but
 * instead of Pentas the styleTree's leafs are canvas2D style properties.
 */
GoldenBody.prototype.createStyleTree = function(PS) {

  let mainStyles = {
    middle: PS.all(PS.strokes.dark.magenta, PS.fills.weak.magenta),
    outer: PS.all(PS.strokes.cyan, PS.fills.weak.cyan, PS.dashes.finest),
    inner: PS.all(PS.strokes.red, PS.fills.weak.red)
  }

  let coreStyles = Object.assign({
    lineWidth: 1
  }, mainStyles, {
    middle: PS.all(PS.strokes.cyan, PS.fills.weak.cyan, PS.dashes.finest),
  });

  let supersGradientStyle = {
    upper: PS.all(
      PS.strokes.cyan,
      PS.dashes.finest,
      PS.fills.weak.cyan,
      PS.gradient(this.pentaTree.supers.upper, PS.alpha(PS.colors.cyan, 0.15), PS.alpha(PS.colors.cyan, 0))
    ),
    lower: PS.all(
      PS.strokes.cyan,
      PS.dashes.finest,
      PS.fills.weak.cyan,
      PS.gradient(this.pentaTree.supers.lower, PS.alpha(PS.colors.cyan, 0.15), PS.alpha(PS.colors.cyan, 0))
    )
  };

  this.styleTree = Object.assign({
      lineWidth: 1.5
    },
    mainStyles, {
      cores: coreStyles
    }, {
      supers: {
        upper: supersGradientStyle.upper,
        lower: supersGradientStyle.lower
      }
    }, {
      extremities: {
        upper: mainStyles,
        lower: mainStyles
      }
    }
  );

  console.log('styleTree');
  console.log(this.styleTree);
}

GoldenBody.prototype.getPentaSubtree = function(propertyPath) {
  if (!propertyPath) return;

  let subtree = this.pentaTree;
  propertyPath.forEach((prop) => subtree = subtree[prop]);
  return subtree;
}
