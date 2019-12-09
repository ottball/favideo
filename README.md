# Favideo

Favideo updates your website's Favicon.

Favideo supports multiple modes:
* VideoMode: update the favicon to reflect a \<video\>'s frame.
* PlayIconMode: reshape the favicon to a play-icon when the video is playing, and recolor to match the video frame.
* RecolorMode: recolor the favicon to contain colors of the \<video\> frame.

Favideo supports the following input types:
* VideoInput: a \<video\> tag.
* WebVTTInput: a WebVTT file with preview thumbnails.

## Remarks
* Favideo uses \<canvas\> elements to draw images. Don't [taint](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image) the canvas and its images.

# Install
* Run `npm install` to install the NPM dependencies.
* Run `npm run build` to generate favicon.js.

# Demo
* Run `npm run serve` to start a local webserver.
* Point your browser to http://localhost:8080/index.html.