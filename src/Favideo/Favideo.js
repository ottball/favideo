import {Favicon} from "../Util/Favicon";
import {Canvas} from "../Util/Canvas";

export class Favideo {
    constructor(input, mode, faviconSize) {
        this.input = input;
        this.mode = mode;
        this.favicon = new Favicon();
        this.favicon.size = faviconSize;
        this.faviconCanvas = new Canvas();
        this.videoEventListeners = [];
        this.enable();
    }

    /**
     * This function fetches and sets the frame for the configured FavideoMode.
     */
    update() {
        let frameUrl = this.mode.getFaviconFrame(this.input, this.faviconCanvas.node, this.faviconCanvas.ctx, this.favicon);
        if (frameUrl) {
            this.favicon.update(frameUrl);
        }
    };

    /**
     * This function registers the update event for the configured FavideoMode.
     */
    enable() {
        this.mode.registerUpdateEvent(this);
    };

    /**
     * This function unregisters the update event for the configured FavideoMode.
     */
    disable() {
        this.unregisterVideoEvents();
        this.mode.disable();
    }

    /**
     * This function registers and attaches a video event handler.
     * @param event
     * @param func
     */
    registerVideoEvent(event, func) {
        this.videoEventListeners.push({event: event, func: func});
        this.input.video.addEventListener(event, func);
    }

    /**
     * This function unregisters all video event handlers.
     */
    unregisterVideoEvents() {
        for (let i = 0; i < this.videoEventListeners.length; i++) {
            let vel = this.videoEventListeners[i];
            this.input.video.removeEventListener(vel.event, vel.func);
        }
    }
}