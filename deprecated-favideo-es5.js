let favicon = document.getElementById('favicon');
let canvas = document.createElement("canvas");
let canvasCtx = canvas.getContext('2d');
let canvasWidth = 0, canvasHeight = 0;
let faviconLength = 48;
let videoInCanvasSettings = {
    width: 0, height: 0, offset: 0
};
let respectAspectRatio = false;

const getImg = function() {
    if (respectAspectRatio) {
        canvasCtx.drawImage(video, videoInCanvasSettings.dx, videoInCanvasSettings.dy, videoInCanvasSettings.dWidth, videoInCanvasSettings.dHeight);
    } else {
        canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    return canvas.toDataURL();
};

const updateFavicon = function(url) {
    favicon.href = url;
};

/**
 * This function captures the current frame as an image, and sets it to the favicon.
 */
const timeupdateHandler = function() {
    let currentFrameUrl = getImg();
    updateFavicon(currentFrameUrl);
};

/**
 * This function measures the new video profile inside of the favicon.
 * @param a: max(videoWidth, videoHeight)
 * @param b: min(videoWidth, videoHeight)
 * @param fl: favicon length
 * @returns {{offset: number, width: *, height: number}}
 */
const getVideoInFaviconFit = function(a, b, fl) {
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
 * @param faviconLength
 */
const calculateAndSetVideoInCanvasProfile = function(video, faviconLength) {
    let v_w = video.videoWidth, v_h = video.videoHeight;
    let videoFit;
    if (v_w > v_h) {
        videoFit = getVideoInFaviconFit(v_w, v_h, faviconLength);
        videoInCanvasSettings.dx = 0;
        videoInCanvasSettings.dy = videoFit.offset;
        videoInCanvasSettings.dWidth = videoFit.width;
        videoInCanvasSettings.dHeight = videoFit.height;
    } else {
        videoFit = getVideoInFaviconFit(v_h, v_w, faviconLength);
        videoInCanvasSettings.dx =  videoFit.offset;
        videoInCanvasSettings.dy = 0;
        videoInCanvasSettings.dWidth = videoFit.height;
        videoInCanvasSettings.dHeight = videoFit.width;
    }
};

/**
 * This event handler updates the canvas width and height,
 * because the video width and height are now known.
 */
const loadedmetadataHandler = function() {
    if (respectAspectRatio) {
        calculateAndSetVideoInCanvasProfile(video, faviconLength);
        canvasHeight = faviconLength;
        canvasWidth = faviconLength;
    } else {
        canvasWidth = video.videoWidth;
        canvasHeight = video.videoHeight;
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
};

/**
 * This function connects a HTML5 video element with the favicon.
 *
 * @param video: the related video element
 * @param respectAspectRatio_: set to `false` if you want a squared video, or to `true` if you want to maintain the
 * aspect ratio
 * @param fps: the fps frequency at which the video is drawn to the the favicon. Setting to `false` will let the
 * video be drawn every `timeupdate` event of the video.
 */
const connectVideoToFavicon = function(video, respectAspectRatio_, fps) {
    respectAspectRatio = respectAspectRatio_;
    video.addEventListener('loadedmetadata', loadedmetadataHandler);
    if (!fps) {
        video.addEventListener('timeupdate', timeupdateHandler);
    } else {
        setInterval(timeupdateHandler, 1000/fps);
    }
};