/**
 * Creates the same structure as pentaTree but instead of Pentas
 * the styleTree's leafs are canvas2D style properties.
 */
function createStyleTree(goldenBody) {

  let PS = goldenContext.pentaStyle;

  let mainStyles = {

    drawCircle: true,
    fillCircle: true,
    drawPentagram: true,
    fillPentagram: true,
    drawPentagon: true,
    fillPentagon: true,

    lineWidth: 4 * 1.5,
    fillStyle: PS.colors.transparent.black,
    middle: PS.strokes.dark.magenta,
    outer: PS.all(PS.strokes.cyan, PS.fills.light.cyan),
    inner: PS.all(PS.strokes.red, PS.fills.light.red)
  }
  mainStyles.middle.upper = PS.fills.aGlowOf.magenta;
  mainStyles.middle.lower = PS.fills.aGlowOf.magenta;

  let coreStyles = copy(mainStyles);

  coreStyles.lineWidth = 4 * 1;

  goldenBody.styleTree = copy(mainStyles);
  goldenBody.styleTree.cores = copy(coreStyles);
  //goldenBody.styleTree.cores.middle = copy(coreStyles,PS.fills.magenta)

  goldenBody.styleTree.supers = {
    drawCircle: false,
    drawPentagon: false,
    drawPentagram: false,
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

  goldenBody.styleTree.spots = {
    radius: goldenBody.root.radius * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_,

    inner: {
      fillCircle: PS.fills.aGlowOf.red,
      fillStar: PS.fills.yellow,
      drawStar: PS.strokes.dark.red,

      lower: {
        radius: goldenBody.root.radius * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_
      }
    },

    outer: {
      fillCircle: PS.fills.aGlowOf.cyan,
      drawCircle: false,
      fillStar: PS.fills.yellow,
      drawStar: PS.strokes.dark.cyan,

      upper: {
        lineWidth: 12
      }
    },

    middle: {
      fillCircle: PS.fills.aGlowOf.magenta,
      fillStar: PS.fills.bright.yellow,
      drawStar: PS.strokes.dark.magenta
    },

    cores: {
      fillStar: PS.fills.red,
      drawStar: PS.strokes.yellow,
      fillCircle: PS.fills.aShineOf.yellow
    }
  }

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
  console.log('styleTree');
  console.log(goldenBody.styleTree);
}
