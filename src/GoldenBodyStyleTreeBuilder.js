/**
 * Creates the same structure as pentaTree but instead of Pentas
 * the styleTree's leafs are canvas2D style properties.
 */
function createStyleTree(goldenBody) {

    let PS = goldenContext.pentaStyles;

    const INNER_FILL = PS.fills.mix(PS.colors.alpha[3].red, PS.colors.alpha[3].yellow, 3, 1);

    let mainStyles                 = {

        fillCircle   : true,
        drawCircle   : true,
        fillPentagram: false,
        drawPentagram: true,
        fillPentagon : false,
        drawPentagon : true,

        lineWidth: 6,
        fillStyle: PS.colors.transparent.black,
        middle   : {
            ...PS.fills.aShineOf.magenta,
            upper       : PS.strokes.mix(PS.colors.yellow, PS.colors.alpha[8].magenta, 1, 1),
            lower       : PS.strokes.mix(PS.colors.alpha[9].yellow, PS.colors.alpha[7].magenta, 1, 1),
            fillPentagon: false,
            fillCircle  : false,
            drawPentagon: false
        },
        inner    : PS.all(PS.strokes.dark.red, INNER_FILL),
        outer    : PS.all(PS.strokes.dark.cyan, PS.fills.alpha[3].cyan),
        outerst  : PS.all(PS.strokes.dark.alpha[5].red, PS.fills.aShineOf.red)
    };
    mainStyles.inner.drawPentagram = false;
    mainStyles.inner.drawCircle    = false;
    mainStyles.inner.drawPentagon  = false;
    mainStyles.inner.drawPentagram = false;
    mainStyles.inner.upper         = {
        drawPentagon: PS.strokes.red
    };
    mainStyles.inner.lower         = {
        drawPentagram: PS.strokes.red,
        drawPentagon : PS.strokes.red
    };
    mainStyles.inner.fillPentagon  = INNER_FILL;
    mainStyles.inner.fillCircle    = false;

    mainStyles.middle.lineWidth           = 5;
    mainStyles.middle.fillCircle          = false;
    mainStyles.middle.fillPentagram       = false;
    mainStyles.middle.fillPentagon        = PS.fills.alpha[3].magenta;
    mainStyles.middle.drawCircle          = false;
    mainStyles.middle.drawPentagram       = PS.strokes.red;
    mainStyles.middle.upper.drawPentagram = PS.strokes.red;
    mainStyles.middle.lower.drawPentagon  = PS.strokes.red;
    mainStyles.outer.fillStar             = PS.fills.alpha[7].cyan;
    mainStyles.outer.drawCircle           = false;
    mainStyles.outer.drawPentagon         = false;

    mainStyles.outerst.middle        = PS.strokes.alpha[4].magenta;
    mainStyles.outerst.drawPentagram = false;
    mainStyles.outerst.fillPentagram = false;
    mainStyles.outerst.fillStar      = false;

    mainStyles.outerst2 = PS.all(PS.strokes.dark.alpha[5].cyan, PS.fills.aShineOf.alpha[7].cyan);


    goldenBody.styleTree = copy(mainStyles);

    //
    // Cores

    goldenBody.styleTree.cores           = copy(mainStyles);
    goldenBody.styleTree.cores.lineWidth = 4 * 1;

    goldenBody.styleTree.cores.inner.fillCircle = PS.fills.alpha[5].red;
    goldenBody.styleTree.cores.outer.fillCircle = PS.fills.alpha[5].cyan;
    goldenBody.styleTree.cores.middle.upper     = {
        strokeStyle: PS.colors.alpha[3].magenta,
        drawCircle : PS.strokes.alpha[7].yellow
    };
    goldenBody.styleTree.cores.middle.lower     = goldenBody.styleTree.cores.middle.upper;

    // TODO: Bugfix: wieso überschreiben die folgenden Zeilen den gelben stroke von oben?

    // goldenBody.styleTree.cores.middle.fillPentagram = PS.all(
    //   PS.strokes.mix(PS.colors.dark.cyan, PS.colors.magenta),
    //   PS.fills.alpha[8].white
    // );
    goldenBody.styleTree.cores.middle.fillPentagon  = false;
    goldenBody.styleTree.cores.middle.drawPentagram = PS.strokes.alpha[5].cyan;

    //goldenBody.styleTree.cores.middle.drawCircle = PS.strokes.dark.cyan;
    goldenBody.styleTree.cores.middle.fillStar = PS.fills.alpha[5].cyan;

    //
    // Supers

    goldenBody.styleTree.supers = {
        lineWidth   : 1,
        drawCircle  : false,
        drawPentagon: false,

        inner : {
            drawPentagram: PS.strokes.alpha[3].orange,
            fillPentagram: true,
            upper        : PS.fills.alpha[1].red,
            lower        : PS.fills.alpha[1].red,
        },
        outer : {
            drawPentagram: PS.strokes.bright.cyan,
            upper        : PS.fills.aShineOf.cyan,
            lower        : PS.fills.aShineOf.cyan,
        },
        middle: {
            drawCircle   : PS.strokes.bright.magenta,
            drawPentagram: PS.strokes.bright.magenta,
            upper        : {
                ...PS.fills.aShineOf.magenta,
                ...PS.strokes.alpha[3].magenta
            },
            lower        : {
                ...PS.fills.aShineOf.magenta,
                ...PS.strokes.mix(PS.colors.alpha[3].magenta, PS.colors.alpha[3].blue, 2, 1)
            }
        }
    };

    //
    // Golden Spots
    const radiusXXL = PM.gold_;
    const radiusXL  = PM.gold_ * PM.gold_;
    const radiusL   = PM.gold_ * PM.gold_ * PM.gold_;
    const radiusM   = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;
    const radiusS   = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;
    const radiusXS  = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;
    const radiusXXS = PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_ * PM.gold_;

    goldenBody.styleTree.spots = {
        radius: goldenBody.root.radius * radiusXS,

        lineWidth: 4,

        inner: {
            upper     : {
                radius: goldenBody.root.radius * radiusXL * 0.9
            },
            lower     : {
                radius: goldenBody.root.radius * radiusL * 0.9
            },
            // TODO: wieso hat nur ein Spot die innere Farbe des Gradienten?
            // fillCircle  : PS.getRadialGradientFillStyleMaker(
            //     PS.colors.alpha[2].orange,
            //     PS.colors.alpha[3].orange,
            //     0,
            //     1
            // ),
            fillCircle: PS.fills.alpha[2].orange,
            drawCircle: PS.strokes.alpha[5].red,
            // fillStar: { fillStyle: PS.mixColors(PS.colors.red, PS.colors.yellow, 4, 1) },
            // drawStar: PS.strokes.yellow,
        },

        outer: {
            fillCircle: PS.fills.aGlowOf.cyan,
            drawCircle: false,
            fillStar  : PS.fills.alpha[9].yellow,
            drawStar  : PS.strokes.dark.cyan,
        },

        middle: {
            upper     : {
                radius: goldenBody.root.radius * radiusL * 0.9
            },
            lower     : {
                radius: goldenBody.root.radius * radiusM * 0.9
            },
            radius    : goldenBody.root.radius * radiusS,
            fillCircle: PS.fills.aShineOf.orange,
            drawCircle: PS.strokes.dark.alpha[5].magenta,
        }
    };

    goldenBody.styleTree.spots.cores = {
        lineWidth: 1,
        radius   : goldenBody.root.radius * radiusXXS,

        inner : goldenBody.styleTree.spots.inner,
        outer : goldenBody.styleTree.spots.outer,
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
        shoulder     : copy(mainStyles.outer),
        innerShoulder: copy(mainStyles.inner),
        upperArm     : copy(mainStyles.outer),
        ellbow       : copy(mainStyles.middle),
        lowerArm     : copy(mainStyles.inner),
    }

    goldenBody.styleTree.outerExtremities = {
        left : copy(outerExtremitiesStyles),
        right: copy(outerExtremitiesStyles)
    };

    function copy(object) {
        if (typeof object === "object") {
            return Object.keys(object).reduce((clone, key) => {
                    clone[key] = copy(object[key])
                    return clone;
                },
                {});
        } else {
            return object
        }
    }

    function toString(goldenBody) {
        return "GoldenBody.styleTree = " +
            JSON.stringify(goldenBody.styleTree, null, 2);
    }

    document.getElementById('golden-body-style-tree').innerHTML = toString(goldenBody);
}

function createDiamondStyleTree(goldenBody) {

    goldenBody.styleTree.middle              = PS.strokes.dark.red;
    goldenBody.styleTree.middle.fillPentagon = PS.fills.red;
    goldenBody.styleTree.middle.fillCircle   = PS.fills.alpha[5].magenta;
    goldenBody.styleTree.inner.fillPentagram = PS.fills.red;
    goldenBody.styleTree.inner.fillPentagon  = false;
    goldenBody.styleTree.inner.fillCircle    = false;

    goldenBody.styleTree.supers.middle.fillCircle          = PS.fills.aShineOf.magenta;
    goldenBody.styleTree.supers.middle.drawPentagon        = false;
    goldenBody.styleTree.supers.middle.drawPentagram       = false;
    goldenBody.styleTree.supers.middle.lower.fillCircle    = PS.fills.alpha[3].magenta;
    goldenBody.styleTree.supers.middle.lower.fillPentagram = false;
    goldenBody.styleTree.supers.middle.lower.fillPentagon  = false;
    goldenBody.styleTree.supers.inner.fillPentagram        = PS.fills.alpha[2].red;
    goldenBody.styleTree.supers.inner.fillPentagon         = true;
    goldenBody.styleTree.supers.inner.drawPentagram        = false;
}