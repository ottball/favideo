import {FavideoMode} from "./FavideoMode";
import {Color} from "../../Util/Color";

export class RecolorMode extends FavideoMode {
    constructor(fps, colorType) {
        super();
        this.fps = fps;
        this.colorType = colorType;
    }

    /**
     * This function set the canvas based on the original favicon which can be recolored.
     * @param favicon
     */
    setFavicon(favicon) {
        let img = document.createElement("img");
        let onImageLoaded = () => {
            let canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalWidth;
            let context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            this.faviconCanvasCtx = context;
            this.faviconCanvas = canvas;
        };
        img.addEventListener("load", onImageLoaded.bind(this));
        img.src = favicon.href;
    }

    /**
     * This function returns the to be rendered frame for FavideoModeVideo.
     * @param video
     * @param canvas
     * @param canvasCtx
     * @returns {string}
     */
    getFaviconFrame(input, canvas, canvasCtx, favicon) {
        if (!this.faviconCanvasCtx) {
            this.setFavicon(favicon);
        }

        // draw video frame on to original size faviconCanvas
        let canvas2 = document.createElement('canvas');
        canvas2.width = input.video.videoWidth;
        canvas2.height = input.video.videoHeight;
        let canvasCtx2 = canvas2.getContext('2d');
        canvasCtx2.drawImage(input.getSource(), 0, 0, canvas2.width, canvas2.height);
        let pixelColor = this.getColor(canvas2, canvasCtx2);

        if (!this.faviconCanvasCtx) {
            // console.warn("favicon not yet ready");
            return null;
        }
        this.faviconCanvasCtx.globalCompositeOperation = "source-in";
        this.faviconCanvasCtx.fillStyle = pixelColor;
        this.faviconCanvasCtx.fillRect(0, 0, this.faviconCanvas.width, this.faviconCanvas.height);
        this.faviconCanvasCtx.fill();

        return this.faviconCanvas.toDataURL();
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