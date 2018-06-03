
function setupAnimations() {

    const ops = new PentaPainterOps();

    goldenContext.animationCanvas = document.createElement('canvas');
    goldenContext.animationCanvas.width = goldenContext.canvasSize.width;
    goldenContext.animationCanvas.height = goldenContext.canvasSize.height;

    goldenContext.animationStartTime = 0;

    goldenContext.animateTreePath = ["spots.cores.outer", "spots.cores.middle", "spots.inner", "spots.outer", "spots.middle"];

    goldenContext.animateSpot = (spot, propertyPathArray) => {
        let rotationPerSecond = Math.PI;
        let rotationAngle = rotationPerSecond * (dt() / 1000);
        spot.rotate(rotationAngle);
        let radius = ops.styler.getCascadingProperties(goldenContext.goldenBody.styleTree.spots, propertyPathArray, ['radius']).radius;
        spot.resize(radius + (radius * 0.4 * Math.sin(2 * rotationAngle)));
    };

    document.addEventListener('keypress', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            event.stopPropagation();
            if (!goldenContext.animationStartTime) {
                startAnimation();
            } else {
                stopAnimation();
            }
        }
    });

    function startAnimation() {
        goldenContext.animationStartTime = Date.now();
        goldenContext.painter.paintGoldenBody(goldenContext.goldenBody);
        window.requestAnimationFrame(animate);
    }

    function stopAnimation() {
        goldenContext.animationStartTime = 0;
        repaint();
    }

    function animate() {
        if (goldenContext.animationStartTime) {
            //console.log("animation running for ", (dt() / 1000).toFixed(2), " seconds...");
            repaint(true);
            window.requestAnimationFrame(animate);
        }
    }

    function dt() {
        return Date.now() - goldenContext.animationStartTime
    };
}
