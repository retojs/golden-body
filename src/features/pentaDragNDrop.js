
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
