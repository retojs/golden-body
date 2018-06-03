/**
 * Creates the same structure as pentaTree but instead of Pentas
 * the styleTree's leafs are canvas2D style properties.
 */
function createStyleTree(goldenBody) {

  let PS = goldenContext.pentaStyles;

  let mainStyles = {

    fillCircle: true,
    drawCircle: true,
    fillPentagram: false,
    drawPentagram: true,
    fillPentagon: true,
    drawPentagon: true,

    lineWidth: 6,
    fillStyle: PS.colors.transparent.black,
    outer: PS.all(PS.strokes.dark.cyan, PS.fills.alpha[3].cyan),
    inner: PS.all(PS.strokes.dark.red, PS.fills.mix(PS.colors.alpha[3].red, PS.colors.alpha[3].yellow, 3, 1)),
    middle: {
      ...PS.fills.aShineOf.magenta,
      upper: PS.strokes.mix(PS.colors.dark.magenta, PS.colors.magenta, 2, 1),
      lower: PS.strokes.dark.magenta
    }
  }

  goldenBody.styleTree = copy(mainStyles);

  //
  // Cores

  goldenBody.styleTree.cores = copy(mainStyles);
  goldenBody.styleTree.cores.lineWidth = 4 * 1;

  goldenBody.styleTree.cores.inner.fillPentagram = PS.fills.alpha[5].red;
  goldenBody.styleTree.cores.outer.fillCircle = PS.fills.alpha[5].cyan;
  goldenBody.styleTree.cores.middle = PS.all(
    PS.strokes.mix(PS.colors.dark.cyan, PS.colors.magenta),
    PS.fills.alpha[3].cyan
  );
  goldenBody.styleTree.cores.middle.drawCircle = PS.strokes.dark.cyan;

  //
  // Supers

  goldenBody.styleTree.supers = {
    drawCircle: false,
    drawPentagon: false,

    inner: {
      drawPentagram: PS.strokes.alpha[3].orange,
      upper: PS.fills.aShineOf.red,
      lower: PS.fills.aShineOf.red
    },
    outer: {
      drawPentagram: PS.strokes.bright.cyan,
      upper: PS.fills.aShineOf.cyan,
      lower: PS.fills.aShineOf.cyan,
    },
    middle: {
      upper: {
        ...PS.fills.aShineOf.magenta,
        ...PS.strokes.alpha[3].magenta
      },
      lower: {
        ...PS.fills.aShineOf.magenta,
        ...PS.strokes.mix(PS.colors.alpha[3].magenta, PS.colors.alpha[3].blue, 2, 1)
      },
      drawCircle: PS.strokes.bright.magenta
    }
  };

  //
  // Golden Spots

  goldenBody.styleTree.spots = {
    radius: goldenBody.root.radius * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_,

    inner: {
      fillCircle: PS.fills.alpha[5].yellow,
      drawCircle: PS.strokes.alpha[7].red,
      fillStar: { fillStyle: PS.mixColors(PS.colors.red, PS.colors.yellow, 4, 1) },
      drawStar: PS.strokes.yellow
    },

    outer: {
      fillCircle: PS.fills.aGlowOf.cyan,
      drawCircle: false,
      fillStar: PS.fills.alpha[9].yellow,
      drawStar: PS.strokes.dark.cyan
    },

    middle: {
      fillCircle: PS.fills.light.magenta,
      fillStar: PS.fills.yellow,
      drawStar: PS.strokes.dark.magenta
    }
  };

  goldenBody.styleTree.spots.cores = {
    radius: goldenBody.styleTree.spots.radius / PM.gold,

    inner: goldenBody.styleTree.spots.inner,
    outer: goldenBody.styleTree.spots.outer,
    middle: goldenBody.styleTree.spots.middle
  };

  goldenBody.styleTree.spots.cores.middle = {
    drawStar: PS.strokes.alpha[5].magenta,
    fillStar: PS.fills.alpha[7].white
  };

  // 
  // Extremitites

  goldenBody.styleTree.extremities = {
    upper: {
      upper: copy(mainStyles),
      lower: copy(mainStyles)
    },
    lower: copy(mainStyles)
  };

  let outerExtremitiesStyles = {
    shoulder: copy(mainStyles.outer),
    innerShoulder: copy(mainStyles.inner),
    upperArm: copy(mainStyles.outer),
    ellbow: copy(mainStyles.middle),
    lowerArm: copy(mainStyles.inner),
  }

  goldenBody.styleTree.outerExtremities = {
    left: copy(outerExtremitiesStyles),
    right: copy(outerExtremitiesStyles)
  };

  function copy(object) {
    if (typeof object === "object") {
      return Object.keys(object).reduce((clone, key) => {
        clone[key] = copy(object[key])
        return clone;
      },
        {});
    }
    else { return object }
  }

  function toString(goldenBody) {
    return "GoldenBody.styleTree = " +
      JSON.stringify(goldenBody.styleTree, null, 2);
  }

  document.getElementById('golden-body-style-tree').innerHTML = toString(goldenBody);
}

function createDiamondStyleTree(goldenBody) {

  goldenBody.styleTree.middle = PS.strokes.dark.red;
  goldenBody.styleTree.middle.fillPentagon = PS.fills.red;
  goldenBody.styleTree.middle.fillCircle = PS.fills.alpha[5].magenta;
  goldenBody.styleTree.inner.fillPentagram = PS.fills.red;
  goldenBody.styleTree.inner.fillPentagon = false;
  goldenBody.styleTree.inner.fillCircle = false;

  goldenBody.styleTree.supers.middle.fillCircle = PS.fills.aShineOf.magenta;
  goldenBody.styleTree.supers.middle.drawPentagon = false;
  goldenBody.styleTree.supers.middle.drawPentagram = false;
  goldenBody.styleTree.supers.middle.lower.fillCircle = PS.fills.alpha[3].magenta;
  goldenBody.styleTree.supers.middle.lower.fillPentagram = false;
  goldenBody.styleTree.supers.middle.lower.fillPentagon = false;
  goldenBody.styleTree.supers.inner.fillPentagram = PS.fills.alpha[2].red;
  goldenBody.styleTree.supers.inner.fillPentagon = true;
  goldenBody.styleTree.supers.inner.drawPentagram = false;
}