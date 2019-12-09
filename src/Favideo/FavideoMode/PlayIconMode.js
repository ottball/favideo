import {FavideoMode} from "./FavideoMode";
import {Color} from "../../Util/Color";

export class PlayIconMode extends FavideoMode {
    constructor(fps, colorType) {
        super(fps);
        this.colorType = colorType;
    }

    /**
     * This function returns the to be rendered frame for FavideoModeVideo.
     * @param video
     * @param canvas
     * @param canvasCtx
     * @returns {string}
     */
    getFaviconFrame(input, canvas, canvasCtx, favicon) {

        // draw video frame on to original size faviconCanvas
        let canvas2 = document.createElement('canvas');
        canvas2.width = input.video.videoWidth;
        canvas2.height = input.video.videoHeight;
        let canvasCtx2 = canvas2.getContext('2d');
        canvasCtx2.drawImage(input.getSource(), 0, 0, canvas2.width, canvas2.height);
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

}