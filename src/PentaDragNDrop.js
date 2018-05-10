/*

# mouse handler for each penta

   on mousedown:
    if mouse position matches any edge:
        - drag start

  on mousemove:
    if drag:
        - update edge to current mouse position
        - paint goldenbody

  on mouseup: 
    - drag stop


# how to test edge for hit by mouse:

  - convert mouse pos to canvas pos (scale & translate coordinates)
  - test for each coordinate that (x_edge - r)  <=  x_mouse  <=  (x_edge - r)


# Steps

  - new file, new class
  - attach mousehandlers to canves dom element

  - feature 0: draw mouse position (convertCoordinates(mouse|canvas))
  - feature 1: collision test - highlight selected penta and edge
  - final feature: draw selected penta or edge at mouse position (drag n drop, repaint)

*/

function setupPentaDragNDrop() {

    let spotRadius = goldenContext.scale * 10;

    let hitSpots = [];

    goldenContext.canvas.addEventListener('mousedown', (event) => {
        console.log("mousedown");
        let canvasMousePos = mousePos2canvasPos(event.clientX, event.clientY);
        paintPosition(canvasMousePos);

        hitSpots = getSpotsAtPos(canvasMousePos);
        console.log("hitSpots ", hitSpots);
        //paintSpots(hitSpots);
    });

    goldenContext.canvas.addEventListener('mousemove', (event) => {
        if (hitSpots) {
            console.log("mousemove")
            let canvasMousePos = mousePos2canvasPos(event.clientX, event.clientY);
            hitSpots.forEach(spot => {
                spot[0] = canvasMousePos.x;
                spot[1] = canvasMousePos.y;
            })
            window.requestAnimationFrame(() => goldenContext.painter.paintGoldenBody(goldenContext.goldenBody));
        }
    })

    goldenContext.canvas.addEventListener('mouseup', (event) => {
        console.log("mouseup");
        hitSpots = [];
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

    function paintPosition(pos, color) {
        color = color || goldenContext.pentaStyles.colors.black;
        let scale = getScale();
        goldenContext.ctx.fillStyle = color;
        goldenContext.ctx.fillRect(pos.x, pos.y, scale * 1, scale * 1);
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

    function getCanvasBounds() {
        return goldenContext.canvas.getBoundingClientRect();
    }

    function getScale() {
        return goldenContext.canvas.width / getCanvasBounds().width;
    }

    function mousePos2canvasPos(mouseX, mouseY) {
        let canvasBounds = getCanvasBounds();
        let scale = getScale();
        return getCoords(mouseX, mouseY, canvasBounds.x, canvasBounds.y, scale);
    }

    function getCoords(x, y, originX, originY, scale) {
        return {
            x: (x - originX) * scale,
            y: (y - originY) * scale
        }
    }
}