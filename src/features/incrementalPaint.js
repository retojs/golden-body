
function setupIncrementalPaint() {

    const incrementTimeMillis = 1000;

    let step;
    let backwards;
    let incPaintTimeout;
    let paintOrderLines;

    function stop() {
        step = 1
        clearTimeout(incPaintTimeout);
        console.log("incremental paint stopped");
    }

    function start(shiftKey) {
        stop();
        backwards = shiftKey;
        paintOrderLines = getPaintOrderTextareaLines();
        incPaintTimeout = setTimeout(incPaint);
    }

    function incPaint() {
        if (backwards) {
            goldenContext.paintOrderLines = paintOrderLines.slice(paintOrderLines.length - step, paintOrderLines.length);
        } else {
            goldenContext.paintOrderLines = paintOrderLines.slice(0, step);
        }
        repaint();
        console.log("incremental paint lines " + (backwards ? "backwards" : ""), goldenContext.paintOrderLines);

        if (step < paintOrderLines.length) {
            step += 1;
            incPaintTimeout = setTimeout(incPaint, incrementTimeMillis);
        } else {
            stop();
        }
    }



    goldenContext.canvas.addEventListener('mouseup', (event) => {
        if (isDoubleClick()) {
            if (incPaintTimeout) {
                stop();
            } else {
                start(event.shiftKey);
            }
        } else {
            lastClick = Date.now();
        }
    });

}




