(function(canvas) {

  let ctx = canvas.getContext('2d');
  ctx.lineWidth = 1.75;
  ctx.lineJoin = "round";

  let bodySize = 185;
  let origin = [395, 385];

  let painter = new PentaPainter(ctx, canvas.width, canvas.height);
  painter.paintGoldenBody(new GoldenBody(origin, bodySize, PM.deg90));
  

})(document.getElementById('the-canvas'));