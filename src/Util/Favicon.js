export class Favicon {
    constructor(favicon) {
        let existingFavicon = this.getExistingFavicon();
        if (!existingFavicon) {
            this.node = this.create();
        } else {
            this.originalHref = existingFavicon.href;
            this.node = existingFavicon;
        }
    }
    getExistingFavicon() {
        return document.querySelector('link[rel="shortcut icon"]');
    }
    create() {
        let link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
        return link;
    }

    update(url) {
        this.href = url;
    };

    restoreDefault() {
        if (this.originalHref) {
            this.update(this.originalHref);
        }
    }

    set href(url) {
        this.node.href = url;
    }
    get href() {
        return this.node.href;
    }

    set size(size) {
        this.size_ = size;
        this.node.sizes = size + "x" + size;
    }
    get size() {
        return this.size_;
    }
}