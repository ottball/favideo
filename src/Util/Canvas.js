export class Canvas {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.ctx_ = this.canvas.getContext('2d');
    }
    get node() {
        return this.canvas;
    }
    get ctx() {
        return this.ctx_;
    }
    get width() {
        return this.node.width;
    }
    set width(width) {
        this.node.width = width;
    }
    get height() {
        return this.node.width;
    }
    set height(height) {
        this.node.height = height;
    }
}