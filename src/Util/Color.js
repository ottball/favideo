var quantize = require('quantize');

export class Color {
    static getAverageColor(canvas, ctx) {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let totalRgba = {
            r: 0, g: 0, b: 0, a: 0
        };
        let nbOfPixels = imageData.length/4;
        for (let i = 0; i < imageData.length; i += 4) {
            totalRgba.r = totalRgba.r + imageData[i];
            totalRgba.g = totalRgba.g + imageData[i+1];
            totalRgba.b = totalRgba.b + imageData[i+2];
            totalRgba.a = totalRgba.a + imageData[i+3];
        }
        let avgRgba = {
            r: totalRgba.r/nbOfPixels,
            g: totalRgba.g/nbOfPixels,
            b: totalRgba.b/nbOfPixels,
            a: totalRgba.a/nbOfPixels
        };
        return Color.getRgbaCssString(avgRgba);
    };

    static createPixelArray(imgData, pixelCount) {
        const pixels = imgData;
        const pixelArray = [];

        for (let i = 0, offset, r, g, b, a; i < pixelCount; i++) {
            offset = i * 4;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];

            // If pixel is mostly opaque and not white
            if (typeof a === 'undefined' || a >= 125) {
                if (!(r > 250 && g > 250 && b > 250)) {
                    pixelArray.push([r, g, b]);
                }
            }
        }
        return pixelArray;
    }

    static getDominantColor(canvas, canvasCtx) {
        const imageData  = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelCount = canvas.width * canvas.height;
        const pixelArray = Color.createPixelArray(imageData.data, pixelCount);
        const cmap    = quantize(pixelArray, 4);
        const palette = cmap? cmap.palette() : null;
        return Color.getRgbaCssStringByArray(palette[0]);
    }

    static getRgbaCssString(rgba) {
        return 'rgba('+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+")";
    };

    static getRgbaCssStringByArray(arr) {
        return 'rgba('+arr[0]+","+arr[1]+","+arr[2]+","+255+")";
    }


}