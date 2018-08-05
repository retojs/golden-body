function setupLegendVisibility() {

    let isLegendVisible = true;

    const legendElement = document.getElementById('interaction-legend');

    setLegendVisible(isLegendVisible);

    goldenContext.canvas.addEventListener('mouseenter', () => {
        isLegendVisible = true;
        // isLegendVisible = !isLegendVisible;
        setLegendVisible(isLegendVisible)
    });

    goldenContext.canvas.addEventListener('mouseleave', () => {
        // isLegendVisible = false;
        setLegendVisible(isLegendVisible)
    });

    function setLegendVisible(visible) {
        if (visible) {
            legendElement.style.display = "block";
        } else {
            legendElement.style.display = "none";
        }
    }
}
