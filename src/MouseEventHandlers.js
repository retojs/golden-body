
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

function getSelectedText(el) {
    if (el.selectionStart !== undefined) {// Standards Compliant Version
        var startPos = el.selectionStart;
        var endPos = el.selectionEnd;
        return el.value.substring(startPos, endPos);
    }
    else if (document.selection !== undefined) {// IE Version
        el.focus();
        var sel = document.selection.createRange();
        return sel.text;
    }
}

function setupCanvasZoom() {

    goldenContext.zoom = 1.0;
    goldenContext.translate = { x: 0, y: 0 };

    let translateStart;
    let zoomStart;
    let zoomStartScreenPos;
    let zoomStartCanvasPos;

    goldenContext.canvas.addEventListener('mousedown', (event) => {
        if (event.ctrlKey) {
            translateStart = { x: goldenContext.translate.x, y: goldenContext.translate.y };
            zoomStart = goldenContext.zoom;
            zoomStartScreenPos = [event.screenX, event.screenY];
            zoomStartCanvasPos = mousePos2canvasPos(event.clientX, event.clientY);
        }
    })

    document.addEventListener('mousemove', (event) => {
        if (event.ctrlKey && zoomStartScreenPos) {
            let zoomScreenPos = [event.screenX, event.screenY];
            let zoomFactor = {
                screenX: zoomScreenPos[0] / zoomStartScreenPos[0],
                screenY: zoomScreenPos[1] / zoomStartScreenPos[1],
                screenMinusOffsetX: (zoomScreenPos[0] - getCanvasBounds().x * 1.5) / (zoomStartScreenPos[0] - getCanvasBounds().x * 1.5),
                screenMinusOffsetY: (zoomScreenPos[1] - getCanvasBounds().y * 1.5) / (zoomStartScreenPos[1] - getCanvasBounds().y * 1.5)
            };
            if (zoomFactor.screenX > 1.0) {
                //zoomFactor.value = zoomFactor.screenMinusOffsetX;
                zoomFactor.value = Math.max(zoomFactor.screenMinusOffsetX, zoomFactor.screenMinusOffsetY);
            } else {
                // zoomFactor.value = zoomFactor.screenX;
                zoomFactor.value = Math.min(zoomFactor.screenX, zoomFactor.screenY);
            }
            let zoom = zoomStart * zoomFactor.value;
            goldenContext.zoom = zoom;

            // Equation to calculate the translation for a given zoom:
            //
            // # Coordinate transformation:
            //    canvasPos.x = viewPortPos.x / zoom - translate.x (see function mousePos2canvasPos)
            // -> viewPortPos.x = (canvasPos.x + translate) * zoom 
            // 
            // # Invariant: 
            //    viewPortPos = mousePosition at zoom start does not move while zooming.
            // -> zoomStartViewPortPos.x = (zoomStartCanvasPos.x + startTranslate.x) * startZoom
            //                           = (zoomStartCanvasPos.x + translate.x) * zoom
            // -> translate.x = (zoomStartCanvasPos.x + startTranslate.x) * startZoom / zoom - zoomStartCanvasPos.x

            goldenContext.translate.x = ((zoomStartCanvasPos.x + translateStart.x) * zoomStart / zoom) - zoomStartCanvasPos.x;
            goldenContext.translate.y = ((zoomStartCanvasPos.y + translateStart.y) * zoomStart / zoom) - zoomStartCanvasPos.y;

            window.requestAnimationFrame(() => {
                goldenContext.painter.paintGoldenBody(goldenContext.goldenBody);
            });
        }
    })

    document.addEventListener('mouseup', (event) => {
        zoomStartScreenPos = undefined;
        zoomStartClientPos = undefined;
        window.requestAnimationFrame(() => {
            goldenContext.painter.paintGoldenBody(goldenContext.goldenBody);
        });
    })
}


function setupPentaDragNDrop() {

    let spotRadius = goldenContext.scale * 10;
    let HIGHLIGHT_SPOTS_ON_HOVER = false;

    goldenContext.hitSpots = [];
    goldenContext.hoverSpots = [];
    let canvaslastHoverSpotsHash = getSpotsHash(goldenContext.hoverSpots);

    goldenContext.canvas.addEventListener('mousedown', (event) => {
        if (event.ctrlKey) return;

        if (event.shiftKey) {
            paintPosition([500, 500], "#f00");
        }

        let canvasMousePos = mousePos2canvasPos(event.clientX, event.clientY);
        console.log("event.clientXY=", event.clientX, event.clientY);
        console.log("canvasMousePos=", canvasMousePos);
        paintPosition(canvasMousePos);
        goldenContext.hitSpots = getSpotsAtPos(canvasMousePos);
    });

    goldenContext.canvas.addEventListener('mousemove', (event) => {
        let canvasMousePos = mousePos2canvasPos(event.clientX, event.clientY);
        if (goldenContext.hitSpots.length > 0) {
            goldenContext.hitSpots.forEach(spot => {
                spot.pos[0] = canvasMousePos.x - spot.hitPos.x;
                spot.pos[1] = canvasMousePos.y - spot.hitPos.y;
            })
            window.requestAnimationFrame(() => goldenContext.painter.paintGoldenBody(goldenContext.goldenBody));
        } else if (HIGHLIGHT_SPOTS_ON_HOVER) {
            goldenContext.hoverSpots = getSpotsAtPos(canvasMousePos);
            if (getSpotsHash(goldenContext.hoverSpots) !== canvaslastHoverSpotsHash) {
                window.requestAnimationFrame(() => goldenContext.painter.paintGoldenBody(goldenContext.goldenBody));
            }
            canvaslastHoverSpotsHash = getSpotsHash(goldenContext.hoverSpots);
        }
    })

    goldenContext.canvas.addEventListener('mouseup', (event) => {
        goldenContext.hitSpots = [];
    })

    function getSpotsAtPos(canvasMousePos, subtree, foundSpots) {
        subtree = subtree || goldenContext.goldenBody.pentaTree;
        foundSpots = foundSpots || [];

        if (isPenta(subtree)) {
            foundSpots = foundSpots.concat(subtree.getEdgesAtPos(canvasMousePos, spotRadius));
        } else {
            Object.keys(subtree).forEach(key => {
                if (subtree[key]) {
                    foundSpots = getSpotsAtPos(canvasMousePos, subtree[key], foundSpots);
                }
            })
        }
        return foundSpots;
    }

    function getSpotsHash(spots) {
        return spots.reduce((hash, spot, i) => {
            hash += 'p' + i + ':x=' + spot.x + ',y=' + spot.y;
            return hash;
        }, "");
    }

    function paintPosition(pos, color) {
        color = color || goldenContext.pentaStyles.colors.black;
        let scale = getScale();
        goldenContext.ctx.fillStyle = color;
        goldenContext.ctx.fillRect(pos.x - scale * 2, pos.y - scale * 2, scale * 4, scale * 4);
    }

    function paintSpots(spots, ops) {
        ops = ops || new PentaPainterOps();
        spots.forEach(spot => paintSpot(spot, ops));
    }

    function paintSpot(spot, ops) {
        ops = ops || new PentaPainterOps();
        let model = {
            x: spot[0],
            y: spot[1],
            radius: spotRadius
        };
        ops.fillCircle(model, { fillStyle: goldenContext.pentaStyles.colors.dark.red });

    }
}


function setupPaintOrderEditing() {
    let paintOrderTextArea = document.getElementById('golden-body-paint-order');
    paintOrderTextArea.innerHTML = `middle`;
    // supers.outer
    // supers.middle
    // outer
    // inner
    // cores.outer
    // cores.inner
    // middle
    // cores.middle
    // spots.cores
    // spots.outer
    // spots.inner
    // spots.middle


    let throttleMillis = 500;
    let lastKeyUp = -1;

    paintOrderTextArea.addEventListener('keyup', () => {
        lastKeyUp = Date.now();
        setTimeout(() => {
            if (getDeltaTime(lastKeyUp) >= throttleMillis) {
                goldenContext.painter.paintGoldenBody(goldenContext.goldenBody);
            }
        }, throttleMillis);
    });

    function getDeltaTime(refTime) {
        return Date.now() - refTime;
    }
}

function setupPaintOrderSelection() {
    let ops = new PentaPainterOps();
    let styler = ops.styler;
    let paintOrderElement = document.getElementById('golden-body-paint-order');
    paintOrderElement.addEventListener('mouseup', (event) => {
        let selected = getSelectedText(paintOrderElement);
        console.log("selected ", selected);
        if (selected && selected.trim()) {
            let propertyPathArrayArray = goldenContext.painter.pathString2Array(selected.trim());
            let properties = styler.styleProperties.concat(ops.opsList);
            let styleProps = styler.getCascadingProperties(goldenContext.goldenBody.styleTree, propertyPathArrayArray, properties);
            console.log("style props of " + selected.trim() + ": ", styleProps);
        }
    });
}