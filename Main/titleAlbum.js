var text = new Blotter.Text("the CALLING", {
  family : "Baskerville Old Face",
  size : 120,
  fill : "#fff"
});

var material = new Blotter.LiquidDistortMaterial();
material.uniforms.uSpeed.value = 0.1;
material.uniforms.uVolatility.value = 0.1;
var blotter = new Blotter(material, { texts : text });
var scope = blotter.forText(text);
scope.appendTo(titleAlbum);
