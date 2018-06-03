function setupLegendVisibility(){
    const legendElement = document.getElementById('interaction-legend');
    goldenContext.canvas.addEventListener('mouseenter', () => {
        legendElement.style.display = "block";
    });
    goldenContext.canvas.addEventListener('mouseleave', () => {
        legendElement.style.display = "none";
    });

}
