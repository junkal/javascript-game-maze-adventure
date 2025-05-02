export class AssetManager {
    constructor(assetList) {
        this.assets = {};
        this.toLoad = assetList.length;
        this.loaded = 0;
        this.ready = false;
        this.onReadyCallback = null;

        this.loadAssets(assetList);
    }

    loadAssets(assetList) {
        assetList.forEach(({ name, src, type }) => {
            if (type === 'image') {
                const img = new Image();
                img.onload = () => this.markLoaded(name, img);
                img.src = src;
            } else if (type === 'audio') {
                const audio = new Audio();
                audio.onloadeddata = () => this.markLoaded(name, audio);
                audio.src = src;
            } else {
                console.warn(`Unsupported asset type for: ${name}`);
                this.markLoaded(name, null);
            }
        });
    }

    markLoaded(name, asset) {
        this.assets[name] = asset;
        this.loaded++;

        if (this.loaded >= this.toLoad) {
            this.ready = true;
            if (this.onReadyCallback) {
                this.onReadyCallback();
            }
        }
    }

    get(name) {
        return this.assets[name] || null;
    }

    onReady(callback) {
        if (this.ready) {
            callback();
        } else {
            this.onReadyCallback = callback;
        }
    }
}