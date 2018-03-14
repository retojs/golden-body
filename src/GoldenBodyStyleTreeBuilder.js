
/**
 * Creates the same structure as pentaTree but instead of Pentas
 * the styleTree's leafs are canvas2D style properties.
 */
function createStyleTree(goldenBody){

  let PS = goldenContext.pentaStyle;

  let mainStyles = {
    lineWidth: 1.5,
    middle: PS.all(PS.strokes.dark.magenta, PS.fills.light.magenta),
    outer: PS.all(PS.strokes.cyan, PS.fills.light.cyan, PS.dashes.finest),
    inner: PS.all(PS.strokes.red, PS.fills.light.red)
  }

  let coreStyles = Object.assign({}, mainStyles);
  coreStyles.lineWidth = 1;
  coreStyles.middle = PS.all(PS.strokes.cyan, PS.fills.light.cyan, PS.dashes.finest);

  let supersStyle = PS.all(
    PS.fills.aShineOf.cyan(goldenBody.pentaTree.supers.upper),
    PS.strokes.cyan,
    PS.dashes.finest,
  );

  goldenBody.styleTree = mainStyles;
  goldenBody.styleTree.cores = coreStyles;

  goldenBody.styleTree.supers = {
    upper: supersStyle,
    lower: supersStyle
  };

  goldenBody.styleTree.extremities = {
    upper: {
      upper: mainStyles,
      lower: mainStyles
    },
    lower: mainStyles
  };

  let outerExtremitiesStyles = {
    shoulder: mainStyles.outer,
    innerShoulder: mainStyles.inner,
    upperArm: mainStyles.outer,
    ellbow: mainStyles.middle,
    lowerArm: mainStyles.inner,
  }

  goldenBody.styleTree.outerExtremities = {
    left: outerExtremitiesStyles,
    right: outerExtremitiesStyles
  };

  goldenBody.styleTree.spots = {
    strokeStyle: PS.colors.dark.cyan,
    fillStyle: PS.colors.magenta
  };
  goldenBody.styleTree.spots.middle = PS.all(PS.strokes.yellow, PS.dashes.finest);
  goldenBody.styleTree.spots.outer = PS.all(PS.strokes.cyan, PS.dashes.finest, PS.fills.cyan);
  goldenBody.styleTree.spots.cores = {
    outer: goldenBody.styleTree.spots.outer
  };
  goldenBody.styleTree.spots.inner = PS.all(PS.strokes.red, PS.dashes.finest, PS.fills.red);

  console.log('styleTree');
  console.log(goldenBody.styleTree);
}
