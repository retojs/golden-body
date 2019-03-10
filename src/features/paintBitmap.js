function setupPaintBitmap() {

    goldenContext.doPaintBitmap = false;

    const thumb = document.getElementById('canvas-image')
    thumb.addEventListener('dblclick', (event) => {
        event.stopPropagation();
        goldenContext.doPaintBitmap = true;
        repaint();
    });
}
