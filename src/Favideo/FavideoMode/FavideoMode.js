export class FavideoMode {

    constructor(fps) {
        this.fps = fps;
    }

    /**
     * This function registers the update event of FavideoModeVideo.
     */
    registerUpdateEvent(favideo) {
        favideo.registerVideoEvent('loadedmetadata', this.loadedmetadataHandler.bind(favideo));
        favideo.registerVideoEvent('pause', this.restoreOriginalFavicon.bind(favideo));
        favideo.registerVideoEvent('ended', this.restoreOriginalFavicon.bind(favideo));
        if (!this.fps) {
            favideo.registerVideoEvent('timeupdate', favideo.update.bind(favideo))
        } else {
            this.interval = setInterval(favideo.update.bind(favideo), 1000/this.fps);
        }
    }

    /**
     * This function restores the original favicon.
     */
    restoreOriginalFavicon() {
        this.favicon.restoreDefault();
    }

    /**
     * This event handler updates the faviconCanvas width and height,
     * because the video width and height are now known.
     */
    loadedmetadataHandler() {
        let canvasWidth = this.favicon.size, canvasHeight = this.favicon.size;
        this.faviconCanvas.width = canvasWidth;
        this.faviconCanvas.height = canvasHeight;
    };

    disable() {
        clearTimeout(this.interval);
    }

}