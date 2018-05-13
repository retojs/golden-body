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
    outer: PS.all(PS.strokes.dark.cyan, PS.fills.alpha[4].cyan),
    inner: PS.all(PS.strokes.dark.red, PS.fills.alpha[2].red),
    middle: PS.all(PS.strokes.dark.magenta, PS.fills.aShineOf.magenta)
  }

  goldenBody.styleTree = copy(mainStyles);

  //
  // Cores

  goldenBody.styleTree.cores = copy(mainStyles, { lineWidth: 4 * 1 });

  goldenBody.styleTree.cores.inner.fillPentagram = PS.fills.alpha[3].red;
  goldenBody.styleTree.cores.outer.fillPentagram = PS.fills.alpha[3].cyan;
  goldenBody.styleTree.cores.middle.fillPentagram = PS.fills.alpha[5].magenta;

  //
  // Supers

  goldenBody.styleTree.supers = {
    drawCircle: false,
    drawPentagon: false,
    drawPentagram: PS.strokes.bright.cyan,

    inner: {
      upper: PS.all(PS.strokes.red, PS.fills.aShineOf.red),
      lower: PS.all(PS.strokes.red, PS.fills.aShineOf.red)
    },
    outer: {
      upper: PS.all(PS.strokes.bright.cyan, PS.fills.aShineOf.cyan),
      lower: PS.all(PS.strokes.bright.cyan, PS.fills.aShineOf.cyan),
    },
    middle: {
      upper: PS.all(PS.strokes.dark.magenta, PS.fills.aShineOf.magenta),
      lower: PS.all(PS.strokes.dark.magenta, PS.fills.aShineOf.magenta)
    }
  };

  //
  // Golden Spots

  goldenBody.styleTree.spots = {
    radius: goldenBody.root.radius * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_,

    inner: {
      fillCircle: PS.fills.aGlowOf.red,
      fillStar: PS.fills.alpha[7].red,
      drawStar: PS.strokes.alpha[7].yellow
    },

    outer: {
      fillCircle: PS.fills.aGlowOf.cyan,
      drawCircle: false,
      fillStar: PS.fills.alpha[7].yellow,
      drawStar: PS.strokes.alpha[7].red
    },

    middle: {
      fillCircle: PS.fills.light.magenta,
      fillStar: PS.makeAShineOf(PS.mixColors(PS.colors.alpha[8].magenta, PS.colors.alpha[7].yellow)),
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
    drawStar: PS.strokes.mix(PS.colors.alpha[3].magenta, PS.colors.white, 1, 3),
    fillStar: PS.fills.mix(PS.colors.alpha[6].magenta, PS.colors.alpha[6].white, 1, 2)
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

  function copy(object, config) {
    return Object.assign({}, object, config);
  }

  function toString(goldenBody) {
    return "GoldenBody.styleTree = " +
      JSON.stringify(goldenBody.styleTree, null, 2);
  }

  document.getElementById('golden-body-style-tree').innerHTML = toString(goldenBody);
}
