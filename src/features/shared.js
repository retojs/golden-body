
function setupShared() {
    goldenContext.doubleClickMaxDelayMillis = 500;
    goldenContext.lastClick;
}

function isDoubleClick() {
    let clickDelay = goldenContext.lastClick ? Date.now() - goldenContext.lastClick : goldenContext.doubleClickMaxDelayMillis;
    let isDoubleClick = clickDelay < goldenContext.doubleClickMaxDelayMillis;
    if (!isDoubleClick) {
        goldenContext.lastClick = Date.now();
    }
    return isDoubleClick;
}

function repaint(unchanged) {
    window.requestAnimationFrame(() => {
        if (unchanged) {
            goldenContext.painter.repaint(goldenContext.offscreenCanvas);
            if (goldenContext.animationStartTime) {
                goldenContext.painter.paintAnimation(goldenContext.goldenBody.pentaTree, goldenContext.goldenBody.styleTree, goldenContext.animateTreePath);
            }
        } else {
            goldenContext.painter.paintGoldenBody(goldenContext.goldenBody);
        }
    });
}

function getCanvasBounds() {
    return goldenContext.canvas.getBoundingClientRect();
}

function getScale() {
    return goldenContext.canvas.width / getCanvasBounds().width;
}

function getCanvasViewPortPos(mouseX, mouseY) {
    let canvasBounds = getCanvasBounds();
    let scale = getScale();
    return getCoords(
        mouseX,
        mouseY,
        canvasBounds.x,
        canvasBounds.y,
        scale
    );
}

function mousePos2canvasPos(mouseX, mouseY) {
    let viewPortPos = getCanvasViewPortPos(mouseX, mouseY);
    goldenContext.translate = goldenContext.translate || { x: 0, y: 0 };
    return {
        x: viewPortPos.x / goldenContext.zoom - goldenContext.translate.x,
        y: viewPortPos.y / goldenContext.zoom - goldenContext.translate.y,
    }
}

function getCoords(x, y, originX, originY, scale) {
    return {
        x: (x - originX) * scale,
        y: (y - originY) * scale
    }
}

function getPaintOrderTextareaLines() {
    const content = document.getElementById('golden-body-paint-order').value;
    return content.split('\n').filter(line => !!line.trim());
}

function setPaintOrderTextareaContent(innerHTML) {
    document.getElementById('golden-body-paint-order').innerHTML = innerHTML;
}