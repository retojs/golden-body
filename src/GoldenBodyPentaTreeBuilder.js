/**
 * A global function?!
 * Are you mad?!?
 * This pollutes the global namespace, you fool!
 *
 * Well, look: The rule you mean may apply for a piece of code
 * that is meant to be part of some bigger piece of code,
 * like a module or a plugin or a component.
 * But this piece of code can stand for itself
 * It's a piece of art, a piece of poetry,
 * a piece of literature, you fool!
 *
 */
function createPentaTree(goldenBody) {

  // Golden Guideline:
  //  It's good practice to name local shortcut references to global variables
  //  in uppercase, like constants, since you should not change global variables.
  let PS = goldenContext.pentaStyle;

  let outerUpper = goldenBody.root;

  let innerUpper = outerUpper.clone({
    radius: outerUpper.innerRadius,
    angle: outerUpper.angle + PM.deg36
  });

  let middle = innerUpper.createSub();

  let outerLower = middle.clone({
    radius: middle.outerRadius
  })
  outerLower.move([0, outerUpper.radius + outerLower.radius - innerUpper.radius]);

  let innerLower = innerUpper.clone({
    radius: innerUpper.radius * PM.gold_,
    angle: middle.angle + PM.deg180
  });
  innerLower.move([0, outerUpper.radius + outerLower.radius]);

  let lowerMiddle = middle.clone({
    radius: middle.radius * PM.gold_,
    angle: middle.angle + PM.deg36
  });
  lowerMiddle.move([0, outerUpper.radius + outerLower.radius - innerLower.radius]);

  //
  // Supers (large blue)

  let upperSuper = outerUpper.clone({
    radius: outerUpper.radius * PM.gold * PM.gold,
    angle: outerUpper.angle + PM.deg180
  });

  let lowerSuper = outerLower.clone({
    radius: outerLower.radius * PM.gold * PM.gold,
    angle: outerLower.angle + PM.deg180
  });

  //
  // Golden spots
  let defaultSpotRadius = goldenBody.root.radius * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;
  let defaultSpots = new GoldenSpots(
    defaultSpotRadius, {
      fillCircle: PS.fills.aGlowOf.white,
      // drawCircle: PS.strokes.bright.cyan,
      fillStar: PS.fills.yellow,
      drawStar: PS.strokes.dark.cyan
    }
  );
  let innerSpots = new GoldenSpots(
    defaultSpotRadius, {
      fillCircle: PS.fills.aGlowOf.red,
      fillStar: PS.fills.yellow,
      drawStar: PS.strokes.dark.red,
    }
  );
  let middleSpots = new GoldenSpots(
    defaultSpotRadius, {
      fillCircle: PS.fills.aGlowOf.magenta,
      fillStar: PS.fills.bright.yellow,
      drawStar: PS.strokes.dark.magenta,
    }
  );

  outerUpper.goldenSpots = defaultSpots.clone();
  outerLower.goldenSpots = defaultSpots.clone();
  innerUpper.goldenSpots = innerSpots.clone();
  innerLower.goldenSpots = innerSpots.clone();
  middle.goldenSpots = middleSpots.clone();

  goldenBody.pentaTree = {

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
  };

  goldenBody.pentaTree.extremities = {
    upper: {
      upper: createExtremities(innerUpper, 2 * PM.deg72, innerLower, outerLower),
      lower: createExtremities(innerUpper, PM.deg72, innerLower, outerLower)
    },
    lower: createExtremities(innerLower, 2 * PM.deg72, innerUpper, outerUpper)
  };

  goldenBody.pentaTree.outerExtremities = {
    left: createOuterExtremity(PM.deg36 + PM.deg72),
    right: createOuterExtremity(-PM.deg36 - PM.deg72)
  };

  function createOuterExtremity(angle) {
    let shoulder = outerUpper.clone({
      radius: outerUpper.radius * PM.gold_,
      angle: outerUpper.angle + PM.deg36
    });
    shoulder.move([0, outerUpper.radius]);
    shoulder.rotate(angle, outerUpper.getCenter());

    let innerShoulder = shoulder.clone({
      radius: shoulder.innerRadius,
      angle: shoulder.angle + PM.deg36
    });

    let upperArm = innerShoulder.clone({
      radius: innerShoulder.radius * PM.gold_,
      angle: innerShoulder.angle + PM.deg36
    });
    upperArm.move([0, 2 * shoulder.innerRadius]);
    upperArm.rotate(angle, innerShoulder.getCenter());

    let lowerArm = upperArm.clone({
      radius: shoulder.radius * PM.gold_
    })

    let ellbow = lowerArm.clone({
      radius: lowerArm.innerRadius,
      angle: upperArm.angle + PM.deg36
    })

    return {
      shoulder: shoulder,
      innerShoulder: innerShoulder,
      upperArm: upperArm,
      ellbow: ellbow,
      lowerArm: lowerArm
    };
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

  function rotateBy(center, penta, angle) {
    return penta.clone().rotate(angle, center.getCenter())
  };

  function toString(goldenBody) {
    return "GoldenBody.pentaTree = " +
      JSON.stringify(goldenBody.pentaTree, (key, value) => {
        if (isPenta(value)) {
          return value.toString();
        }
        if (isGoldenSpots(value)) {
          return value.toString();
        }
        return value;
      }, 2);
  }

  document.getElementById('golden-body-penta-tree').innerHTML = toString(goldenBody);
  console.log('pentaTree');
  console.log(goldenBody.pentaTree);
}
