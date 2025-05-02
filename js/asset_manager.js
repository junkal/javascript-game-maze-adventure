/**
 * AssetManager
 * -------------
 * This class handles loading and managing game assets such as images and audio files.
 * It loads all assets provided in a list and provides access to them once loading is complete.
 * It also supports a callback to notify the game when all assets are ready.
 */
export class AssetManager {
    /**
     * Constructs the AssetManager and starts loading assets.
     * 
     * @param {Array} assetList - List of asset objects, each with { name, src, type }
     */    
    constructor(assetList) {
        this.assets = {};
        this.toLoad = assetList.length;
        this.loaded = 0;
        this.ready = false;
        this.onReadyCallback = null;

        this.loadAssets(assetList);
    }

    /**
     * Loads all assets in the provided list.
     * Supports both 'image' and 'audio' asset types.
     * 
     * @param {Array} assetList - List of asset descriptors
     */    
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

    /**
     * Marks an asset as loaded and stores it.
     * When all assets are loaded, sets `ready` to true and invokes the ready callback.
     * 
     * @param {string} name - Asset identifier
     * @param {object|null} asset - The loaded asset object or null
     */    
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

    /**
     * Retrieves a loaded asset by name.
     * 
     * @param {string} name - Asset identifier
     * @returns {object|null} - The loaded asset, or null if not found
     */    
    get(name) {
        return this.assets[name] || null;
    }

    /**
     * Registers a callback to be called once all assets are loaded.
     * If assets are already ready, the callback is called immediately.
     * 
     * @param {function} callback - Function to call when all assets are ready
     */    
    onReady(callback) {
        if (this.ready) {
            callback();
        } else {
            this.onReadyCallback = callback;
        }
    }
}