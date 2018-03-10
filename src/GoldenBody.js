/**
 * @param center: The upper pentas' centers' position
 * @param radius: The upper large* penta's radius (* or: outer, blue)
 * @param angle:  All pentas' default angle
 * @param style: style configuration
 */
function GoldenBody(center, radius, angle, ps) {

  this.center = center;
  this.radius = radius;
  this.angle = angle || 0;

  this.createPentaTree(ps);

  document.getElementById('golden-body-penta-tree').innerHTML = this.toString();
}

GoldenBody.prototype.toString = function() {
  return "GoldenBody.pentaTree = " +
    JSON.stringify(this.pentaTree, (key, value) => {
      if (isPenta(value)) {
        return value.toString();
      }
      if (isGoldenSpots(value)) {
        return value.toString();
      }
      return value;
    }, 2) +
    "\n\n" +
    "GoldenBody.styleTree = " +
    JSON.stringify(this.styleTree, null, 2);
}

GoldenBody.prototype.createPentaTree = function() {
  let PS = goldenContext.pentaStyle;

  let root = new Penta(this.center, this.radius, this.angle);
  let outerUpper = root;

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

  let spotStylesCyan = PS.all(
    PS.strokes.cyan,
    PS.fills.weak.cyan
  );

  outerUpper.goldenSpots = new GoldenSpots(
    outerUpper,
    outerUpper.radius * PM.gold_ * PM.gold_ * PM.gold_,
    GoldenSpots.optionsStarWithCircle,
    spotStylesCyan
  );

  outerLower.goldenSpots = new GoldenSpots(
    outerLower,
    outerLower.radius * PM.gold_ * PM.gold_ * PM.gold_,
    GoldenSpots.optionsStarWithCircle,
    spotStylesCyan
  );

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
      upper: {
        upper: createExtremities(innerUpper, 2 * PM.deg72, innerLower, outerLower),
        lower: createExtremities(innerUpper, PM.deg72, innerLower, outerLower)
      },
      lower: createExtremities(innerLower, 2 * PM.deg72, innerUpper, outerUpper)
    }
  };

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

    function rotateBy(center, penta, angle) {
      return penta.clone().rotate(angle, center.getCenter())
    };
  };

  console.log('pentaTree');
  console.log(this.pentaTree);
}

/**
 * Creates the same structure as pentaTree but
 * instead of Pentas the styleTree's leafs are canvas2D style properties.
 */
GoldenBody.prototype.createStyleTree = function() {
  let PS = goldenContext.pentaStyle;

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
        upper: {
          upper: mainStyles,
          lower: mainStyles
        },
        lower: mainStyles
      }
    }, {
      spots: {
        middle: {
          circle: true,
          radius: 12,
          style: PS.all(PS.strokes.cyan, PS.dashes.finest, PS.fills.weak.cyan)
        },
        outer: {
          style: PS.all(PS.strokes.cyan, PS.dashes.finest, PS.fills.weak.cyan)
        },
        inner: {
          style: PS.all(PS.strokes.cyan, PS.dashes.finest, PS.fills.weak.cyan)
        }
      }
    }
  );

  console.log('styleTree');
  console.log(this.styleTree);
}

GoldenBody.prototype.getPentaSubtree = function(propertyPathArray) {
  if (!propertyPathArray) return;
  let subtree = this.pentaTree;
  propertyPathArray.forEach((prop) => subtree = subtree[prop]);
  return subtree;
}
