function setupPaintBitmap() {

    goldenContext.doPaintBitmap = false;

    const off = document.getElementById('canvas-image-disabled');

    const showOff = function () {
        off.className = goldenContext.doPaintBitmap ? '' : 'show';
    }

    showOff();

    off.addEventListener('mouseup', (event) => {
        if (isDoubleClick()) {
            goldenContext.doPaintBitmap = !goldenContext.doPaintBitmap;
            showOff();
            if (goldenContext.doPaintBitmap) {
                return;
            }
        }
        event.stopPropagation();
    });
}
