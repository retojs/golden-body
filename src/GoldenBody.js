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
  this.createStyleTree();

  document.getElementById('penta-tree').innerHTML = this.toString();
}

GoldenBody.prototype.toString = function() {
  return "GoldenBody.pentaTree = " +
    JSON.stringify(this.pentaTree, (key, value) => {
      if (isPenta(value)) {
        return "Penta";
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
    radius: outerUpper.radius * PM.gold * PM.gold
  });

  let lowerSuper = outerLower.clone({
    radius: outerLower.radius * PM.gold * PM.gold
  });

  let upperCenter = innerUpper.getCenter();

  this.pentaTree = {

    middle: middle,
    lowerMiddle: lowerMiddle,

    upper: {
      outer: outerUpper,
      inner: innerUpper,
    },
    lower: {
      outer: outerLower,
      inner: innerLower,
    },

    cores: {
      middle: middle.createCore(),
      lowerMiddle: lowerMiddle.createCore(),

      upper: {
        inner: innerUpper.createCore(),
        outer: outerUpper.createCore()
      },
      lower: {
        inner: innerLower.createCore(),
        outer: outerLower.createCore()
      }
    },

    rotated: {
      middle: {
        left: middle.clone().rotate(PM.deg72, upperCenter),
        right: middle.clone().rotate(-PM.deg72, upperCenter)
      },
      lowerMiddle: {
        left: lowerMiddle.clone().rotate(PM.deg72, upperCenter),
        right: lowerMiddle.clone().rotate(-PM.deg72, upperCenter)
      },
      lower: {
        outer: {
          left: outerLower.clone().rotate(PM.deg72, upperCenter),
          right: outerLower.clone().rotate(-PM.deg72, upperCenter)
        },
        inner: {
          left: innerLower.clone().rotate(PM.deg72, upperCenter),
          right: innerLower.clone().rotate(-PM.deg72, upperCenter)
        }
      },
    },

    supers: {
      upper: upperSuper,
      lower: lowerSuper
    }
  }

  console.log('pentaTree');
  console.log(this.pentaTree);
}

/**
 * Creates the same structure as pentaTree but
 * instead of Pentas the styleTree's leafs are canvas2D style properties.
 */
GoldenBody.prototype.createStyleTree = function(penta) {

  let innerOuterStyle = {
    outer: PS.all(PS.strokes.cyan, PS.fills.light.cyan, PS.dashes.finest),
    inner: PS.all(PS.strokes.red, PS.fills.light.red)
  }

  let mainStyles = {
    middle: PS.all(PS.strokes.magenta, PS.fills.light.magenta),
    lowerMiddle: PS.all(PS.strokes.magenta, PS.fills.light.magenta),
    upper: innerOuterStyle,
    lower: innerOuterStyle
  }

  let coreStyles = Object.assign({
    lineWidth: 1
  }, mainStyles);

  this.styleTree = Object.assign({
      lineWidth: 1.5
    },
    mainStyles, {
      cores: coreStyles
    }, {
      rotated: mainStyles
    }, {
      supers: PS.strokes.cyan
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
