let goldenContext = {
  scale: 4,
  size: 480,
  origin: [1788, 1880],
  canvasSize: {
    width: 3600,
    height: 4016
  },
  backgroundColor: '#f5e7ac'
};

goldenContext.canvas = document.getElementById('golden-body-canvas');
goldenContext.canvas.width = goldenContext.canvasSize.width;
goldenContext.canvas.height = goldenContext.canvasSize.width;

goldenContext.offscreenCanvas = document.createElement('canvas');
goldenContext.offscreenCanvas.width = goldenContext.canvasSize.width;
goldenContext.offscreenCanvas.height = goldenContext.canvasSize.height;

goldenContext.ctx = goldenContext.offscreenCanvas.getContext('2d');

goldenContext.pentaStyles = new PentaStyles();

goldenContext.setup = function () {
  this.painter = new PentaPainter();
  this.goldenBody = new GoldenBody(this.origin, this.size, PM.deg90);
  this.painter.paintGoldenBody(this.goldenBody);
}
goldenContext.setup();

/** 
  TODO: immutable sequence of states stored in local storage

     * states of several objects individually -> allow combination
        pentaTree, styleTree, paintOrder etc.

     * every step has 
       - date
       - name (optional)
       - parent
       - children

     * state change is done via
       - clone old state
       - link parent and children
       - apply change

     * on each step the delta/diff is calculated and stored in local storage
     * on demand you can also store the complete state (key frame)

     * you can navigate back and forth in the sequence of states of every part/object.
     * you can change any state in the sequence and create a new branch

     * from states you can create series
     * series have names
     * changing series is also stored as a sequence of states or diffs.
     

    END TODO
*/ 
setupShared();
setupAnimations();
setupCanvasZoomNTranslate();
setupFullScreen();
setupIncrementalPaint();
setupLegendVisibility();
setupPaintBitmap();
setupPaintOrderEditing();
setupPaintOrderSelection();
setupPentaDragNDrop();

// TEST

let angle = PM.angle([11, 0]);
console.log('TEST angle=0? ', angle, PM.toDeg(angle));
angle = PM.angle([11, 11]);
console.log('TEST angle=45? ', angle, PM.toDeg(angle));
angle = PM.angle([0, 11]);
console.log('TEST angle=90? ', angle, PM.toDeg(angle));
angle = PM.angle([-11, 11]);
console.log('TEST angle=135? ', angle, PM.toDeg(angle));
angle = PM.angle([-11, 0]);
console.log('TEST angle=180? ', angle, PM.toDeg(angle));
angle = PM.angle([-11, -11]);
console.log('TEST angle=225?', angle, PM.toDeg(angle));
angle = PM.angle([0, -11]);
console.log('TEST angle=270? ', angle, PM.toDeg(angle));
angle = PM.angle([11, -11]);
console.log('TEST angle=315', angle, PM.toDeg(angle));