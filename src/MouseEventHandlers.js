
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

function setupCanvasZoomNTranslate() {

    goldenContext.zoom = 1.0;
    goldenContext.translate = { x: 0, y: 0 };

    let startScreenPos;
    let startCanvasPos;
    let translateStart;
    let zoomStart;

    goldenContext.canvas.addEventListener('mousedown', (event) => {
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
        repaint(true);
    })


    function calculateZoom(screenPos) {
        console.log("getCanvasBounds().x ", getCanvasBounds().x, ", screenPos[0] ", screenPos[0]);
        let zoomFactor = {
            screenX: screenPos[0] / startScreenPos[0],
            screenY: screenPos[1] / startScreenPos[1],
            screenMinusOffsetX: (screenPos[0] - getCanvasBounds().x * 3) / (startScreenPos[0] - getCanvasBounds().x * 3),
            screenMinusOffsetY: (screenPos[1] - getCanvasBounds().y * 3) / (startScreenPos[1] - getCanvasBounds().y * 3)
        };
        zoomFactor.value = 1 / zoomFactor.screenMinusOffsetX;
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


function setupLegendVisibility(){
    const legendElement = document.getElementById('interaction-legend');
    goldenContext.canvas.addEventListener('mouseenter', () => {
        legendElement.style.display = "block";
    });
    goldenContext.canvas.addEventListener('mouseleave', () => {
        legendElement.style.display = "none";
    });

}

function setupPentaDragNDrop() {

    let spotRadius = goldenContext.scale * 10;
    let HIGHLIGHT_SPOTS_ON_HOVER = false;

    goldenContext.hitSpots = [];
    goldenContext.hoverSpots = [];
    let canvaslastHoverSpotsHash = getSpotsHash(goldenContext.hoverSpots);

    goldenContext.canvas.addEventListener('mousedown', (event) => {
        if (event.ctrlKey) return;

        let canvasMousePos = mousePos2canvasPos(event.clientX, event.clientY);
        //paintPosition(canvasMousePos);
        goldenContext.hitSpots = getVisibleSpotsAtPos(canvasMousePos);
        //console.log("hitSpots= ", goldenContext.hitSpots);
        goldenContext.hitSpots.forEach(spot => spot.penta.saveInitialValues());
    });

    goldenContext.TRIANGLE_MOVE_EDGE = false;

    goldenContext.canvas.addEventListener('mousemove', (event) => {
        let canvasMousePos = mousePos2canvasPos(event.clientX, event.clientY);
        if (goldenContext.hitSpots.length > 0) {
            if (event.shiftKey) {
                goldenContext.TRIANGLE_MOVE_EDGE = true;
            }
            // PentaPainterOps.DO_PAINT_SEGMENTS = true;
            goldenContext.hitSpots.forEach(spot => {
                spot.pos[0] = canvasMousePos.x - spot.hitPos.x;
                spot.pos[1] = canvasMousePos.y - spot.hitPos.y;
                if (goldenContext.TRIANGLE_MOVE_EDGE) {
                    spot.penta.triangleMoveEdge(spot.index, spot.pos);
                } else {
                    spot.penta.moveEdge(spot.index, spot.pos);
                }
            });

            // TODO: prepare list of visible spots per position (some spots are overlapping, i.e. "connected")
            //   traverse tree, for each penta, add all edges, if edges are at the same spot, add them to the same list 
            // from one spot I want to get all connected spots
            // when moving a spot collect all moving edges and move their connected spots, too
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
        goldenContext.TRIANGLE_MOVE_EDGE = false;
        PentaPainterOps.DO_PAINT_SEGMENTS = false;
        goldenContext.hitSpots.forEach(spot => {
            spot.penta.movingEdges = [];
        });
        goldenContext.hitSpots = [];
    })

    function getVisibleSpotsAtPos(canvasMousePos) {
        return goldenContext.visiblePentas.reduce((foundSpots, penta) => foundSpots.concat(penta.getEdgesAtPos(canvasMousePos, spotRadius)), []);
    }

    /** deprecated */
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

const paintOrderStandard = `
supers.outer
supers.inner
supers.middle
outer
inner
middle
cores.outer
cores.inner
cores.middle
spots.cores.middle
spots.cores.outer
spots.middle
spots.inner
spots.outer
`;

const paintOrderOuterAndMiddle = `
supers.outer
supers.middle
outer
middle
cores.inner
cores.middle
`;

const paintOrderDiamondsSimple = `
inner
supers.inner
diamonds.large
diamonds.small
spots.inner 
spots.middle.upper
`;

const paintOrderDiamondsExtended = `
inner
supers.inner
supers.middle
middle
diamonds.large
diamonds.small
spots.inner 
spots.middle.upper
`;

const paintOrderInnerBase = `
supers.inner
supers.middle
inner
middle
spots.middle
spots.inner
`;


function setupPaintOrderEditing() {
    let paintOrderTextArea = document.getElementById('golden-body-paint-order');
    let throttleMillis = 500;
    let lastKeyUp = -1;

    // paintOrderTextArea.innerHTML = paintOrderStandard;
    paintOrderTextArea.innerHTML = paintOrderOuterAndMiddle;
    // paintOrderTextArea.innerHTML = paintOrderDiamondsSimple;
    // paintOrderTextArea.innerHTML = paintOrderDiamondsExtended;
    // paintOrderTextArea.innerHTML = paintOrderInnerBase;

    paintOrderTextArea.addEventListener('keyup', () => {
        lastKeyUp = Date.now();
        setTimeout(() => {
            if (getDeltaTime(lastKeyUp) >= throttleMillis) {
                repaint();
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
        if (selected && selected.trim()) {
            let propertyPathArrayArray = goldenContext.painter.pathString2Array(selected.trim());
            let properties = styler.styleProperties.concat(ops.opsList);
            let styleProps = styler.getCascadingProperties(goldenContext.goldenBody.styleTree, propertyPathArrayArray, properties);
        }
    });
}


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
