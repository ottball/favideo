import {FavideoMode} from "./FavideoMode";

export class FavideoModeVideo extends FavideoMode {
    constructor(respectAspectRatio, fps) {
        super();
        this.respectAspectRatio = respectAspectRatio;
        this.fps = fps;
        this.videoInCanvasSettings = {
            dx: 0, dy: 0, dWidth: 0, dHeight: 0
        }
    }

    /**
     * This function returns the to be rendered frame for FavideoModeVideo.
     * @param video
     * @param canvas
     * @param canvasCtx
     * @returns {string}
     */
    getFaviconFrame(video, canvas, canvasCtx) {
        if (this.respectAspectRatio) {
            canvasCtx.drawImage(video, this.videoInCanvasSettings.dx, this.videoInCanvasSettings.dy, this.videoInCanvasSettings.dWidth, this.videoInCanvasSettings.dHeight);
        } else {
            canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
        return canvas.toDataURL();
    };

    /**
     * This function measures the new video profile inside of the favicon.
     * @param a: max(videoWidth, videoHeight)
     * @param b: min(videoWidth, videoHeight)
     * @param fl: favicon length
     * @returns {{offset: number, width: *, height: number}}
     */
    getVideoInFaviconFit(a, b, fl) {
        let x = a/fl;
        let av_w = fl;
        let av_h = b/x;
        let o_t = (fl-av_h)/2;
        return {
            width: av_w,
            height: av_h,
            offset: o_t
        }
    };

    /**
     * This function checks to what the video needs to be scaled to fit into the favicon,
     * if the aspect ratio is to be respected.
     *
     * @param video
     * @param faviconSize
     */
    calculateAndSetVideoInCanvasProfile(video, faviconSize) {
        let v_w = video.videoWidth, v_h = video.videoHeight;
        let videoFit;
        if (v_w > v_h) {
            videoFit = this.getVideoInFaviconFit(v_w, v_h, faviconSize);
            this.videoInCanvasSettings.dx = 0;
            this.videoInCanvasSettings.dy = videoFit.offset;
            this.videoInCanvasSettings.dWidth = videoFit.width;
            this.videoInCanvasSettings.dHeight = videoFit.height;
        } else {
            videoFit = this.getVideoInFaviconFit(v_h, v_w, faviconSize);
            this.videoInCanvasSettings.dx =  videoFit.offset;
            this.videoInCanvasSettings.dy = 0;
            this.videoInCanvasSettings.dWidth = videoFit.height;
            this.videoInCanvasSettings.dHeight = videoFit.width;
        }
    };

    /**
     * This event handler updates the canvas width and height,
     * because the video width and height are now known.
     */
    loadedmetadataHandler() {
        let canvasWidth = 0, canvasHeight = 0;
        if (this.mode.respectAspectRatio) {
            this.mode.calculateAndSetVideoInCanvasProfile(this.video, this.favicon.size);
            canvasWidth = this.favicon.size;
            canvasHeight = this.favicon.size;
        } else {
            canvasWidth = this.video.videoWidth;
            canvasHeight = this.video.videoHeight;
        }
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
    };

    /**
     * This function registers the update event of FavideoModeVideo.
     */
    registerUpdateEvent(favideo) {
        favideo.registerVideoEvent('loadedmetadata', this.loadedmetadataHandler.bind(favideo));
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