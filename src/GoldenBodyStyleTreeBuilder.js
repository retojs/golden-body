/**
 * Creates the same structure as pentaTree but instead of Pentas
 * the styleTree's leafs are canvas2D style properties.
 */
function createStyleTree(goldenBody) {

  let PS = goldenContext.pentaStyle;

  let mainStyles = {
    lineWidth: 1.5,
    middle: PS.strokes.dark.magenta,
    outer: PS.all(PS.strokes.cyan, PS.fills.light.cyan, PS.dashes.finest),
    inner: PS.all(PS.strokes.red, PS.fills.light.red)
  }
  mainStyles.middle.upper = PS.fills.aGlowOf.magenta(goldenBody.pentaTree.middle.upper);
  mainStyles.middle.lower = PS.fills.aGlowOf.magenta(goldenBody.pentaTree.middle.lower);

  let coreStyles = copy(mainStyles);

  coreStyles.lineWidth = 1;
  coreStyles.middle = PS.all(PS.strokes.cyan, PS.fills.light.cyan, PS.dashes.finest);

  let supersStyle = PS.strokes.bright.cyan;

  goldenBody.styleTree = copy(mainStyles);
  goldenBody.styleTree.cores = copy(coreStyles);

  goldenBody.styleTree.supers = {
    upper: copy(supersStyle, PS.fills.aShineOf.cyan(goldenBody.pentaTree.supers.upper)),
    lower: copy(supersStyle, PS.fills.aShineOf.cyan(goldenBody.pentaTree.supers.lower))
  };

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

  goldenBody.styleTree.spots = PS.all(PS.strokes.dark.cyan);
  goldenBody.styleTree.spots.middle = PS.all(PS.strokes.yellow, PS.dashes.finest);
  goldenBody.styleTree.spots.outer = PS.all(PS.strokes.dark.cyan, PS.dashes.finest);
  goldenBody.styleTree.spots.cores = {
    outer: copy(goldenBody.styleTree.spots.outer)
  };
  goldenBody.styleTree.spots.inner = PS.all(PS.strokes.red, PS.dashes.finest);

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
