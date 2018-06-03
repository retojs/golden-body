
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

    const doubleClickMaxDelayMillis = 500;
    let lastClick;

    goldenContext.canvas.addEventListener('mouseup', (event) => {
        if (isDoubleClick) {
            start(event.shiftKey);
        } else {
            lastClick = Date.now();
        }
    });

    function isDoubleClick() {
        let clickDelay = lastClick ? Date.now() - lastClick : doubleClickMaxDelayMillis;
        return clickDelay < doubleClickMaxDelayMillis;
    }
}




