import {FavideoMode} from "./FavideoMode";
import {Color} from "./Color";

export class FavideoModePlayIcon extends FavideoMode {
    constructor(fps, colorType) {
        super();
        this.fps = fps;
        this.colorType = colorType;
    }

    /**
     * This function returns the to be rendered frame for FavideoModeVideo.
     * @param video
     * @param canvas
     * @param canvasCtx
     * @returns {string}
     */
    getFaviconFrame(video, canvas, canvasCtx, favicon) {

        // draw video frame on to original size faviconCanvas
        let canvas2 = document.createElement('canvas');
        canvas2.width = video.videoWidth;
        canvas2.height = video.videoHeight;
        let canvasCtx2 = canvas2.getContext('2d');
        canvasCtx2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
        let pixelColor = this.getColor(canvas2, canvasCtx2);

        // reset drawing
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        this.drawObject(pixelColor, canvasCtx, favicon.size);

        return canvas.toDataURL();
    };

    getColor(canvas, ctx) {
        switch (this.colorType) {
            case "average":
                return Color.getAverageColor(canvas, ctx);
                break;
            case "dominant":
                return Color.getDominantColor(canvas, ctx);
                break;
            default:

        }
    }

    drawObject(color, canvasCtx, faviconSize) {
        this.drawPlayObject(color, canvasCtx, faviconSize);
    }

    drawPlayObject(color, canvasCtx, faviconSize) {
        canvasCtx.fillStyle = color;
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(0, faviconSize);
        canvasCtx.lineTo(faviconSize, faviconSize/2);
        canvasCtx.fill();
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

    restoreOriginalFavicon() {
        this.favicon.restoreDefault();
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

    disable() {
        clearTimeout(this.interval);
    }
}