/**
 * Lets key 1 toggle full screen.
 */
function setupFullScreen() {

    const canvasContainer = document.getElementById('canvas-container');

    let isFullScreen = true;

    setFullScreen(isFullScreen);

    document.addEventListener('keypress', (event) => {
        if (event.key == '1') {
            isFullScreen = !isFullScreen;
            setFullScreen(isFullScreen);
        }
    });

    function setFullScreen(on) {
        if (on) {
            canvasContainer.className = 'full-screen';
        } else {
            canvasContainer.className = '';
        }
    }
}