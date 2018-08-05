
function setupCanvasZoomNTranslate() {

    goldenContext.zoom = 1.0;
    goldenContext.translate = { x: 0, y: 0 };

    let startScreenPos;
    let startCanvasPos;
    let translateStart;
    let zoomStart;

    goldenContext.canvas.addEventListener('mousedown', (event) => {
        goldenContext.changing = true;
        startScreenPos = [event.screenX, event.screenY];
        startCanvasPos = mousePos2canvasPos(event.clientX, event.clientY);
        translateStart = { x: goldenContext.translate.x, y: goldenContext.translate.y };
        if (event.ctrlKey) {
            zoomStart = goldenContext.zoom;
        }
    })

    document.addEventListener('mousemove', (event) => {
        if (event.ctrlKey) {
            if (zoomStart) {
                goldenContext.zoom = calculateZoom([event.screenX, event.screenY]);
                goldenContext.translate = calculateTranslation(goldenContext.zoom);
                repaint(true);
            }
        } else if (translateStart && goldenContext.hitSpots.length === 0) {
            goldenContext.translate.x = translateStart.x + getScale() * (event.screenX - startScreenPos[0]) / goldenContext.zoom;
            goldenContext.translate.y = translateStart.y + getScale() * (event.screenY - startScreenPos[1]) / goldenContext.zoom;
            repaint(true);
        }
    })

    document.addEventListener('mouseup', (event) => {
        startScreenPos = undefined;
        startCanvasPos = undefined;
        translateStart = undefined;
        zoomStart = undefined;
        goldenContext.changing = false;
        repaint(true);
    })


    function calculateZoom(screenPos) {
        let zoomFactor = {
            screenX: screenPos[0] / startScreenPos[0],
            screenY: screenPos[1] / startScreenPos[1],
            screenMinusOffsetX: (screenPos[0] * 3 - getCanvasBounds().x) / (startScreenPos[0] * 3 - getCanvasBounds().x),
            screenMinusOffsetY: (screenPos[1] - getCanvasBounds().y) / (startScreenPos[1] - getCanvasBounds().y)
        };
        zoomFactor.value = zoomFactor.screenMinusOffsetX;
        return zoomStart * zoomFactor.value;
    }

    function calculateTranslation(zoom) {

        // Equation to calculate the translation for a given zoom:
        //
        // # Coordinate transformation:
        //    canvasPos.x = viewPortPos.x / zoom - translate.x (see function mousePos2canvasPos)
        // -> viewPortPos.x = (canvasPos.x + translate) * zoom 
        // 
        // # Invariant: 
        //    viewPortPos = mousePosition at zoom start does not move while zooming.
        // -> zoomStartViewPortPos.x = (startCanvasPos.x + startTranslate.x) * startZoom
        //                           = (startCanvasPos.x + translate.x) * zoom
        // -> translate.x = (startCanvasPos.x + startTranslate.x) * startZoom / zoom - startCanvasPos.x

        return {
            x: ((startCanvasPos.x + translateStart.x) * zoomStart / zoom) - startCanvasPos.x,
            y: ((startCanvasPos.y + translateStart.y) * zoomStart / zoom) - startCanvasPos.y
        };
    }
}


