class SelectorCache {
    constructor() {
        this.cache = new Map();
    }

    set(key, selector, ttl = 3600000) {
        // TTL in milliseconds (default 1 hour)
        const expiresAt = Date.now() + ttl;

        this.cache.set(key, {
            selector,
            expiresAt
        });

        console.log(`Selector cached: ${key} -> ${selector}`);
    }

    get(key) {
        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        // Check if expired
        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            console.log(`Selector cache expired: ${key}`);
            return null;
        }

        console.log(`Selector retrieved from cache: ${key} -> ${cached.selector}`);
        return cached.selector;
    }

    has(key) {
        const cached = this.cache.get(key);

        if (!cached) {
            return false;
        }

        // Check if expired
        if (Date.now() > cached.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            console.log(`Selector removed from cache: ${key}`);
        }
        return deleted;
    }

    clear() {
        this.cache.clear();
        console.log('Selector cache cleared');
    }

    size() {
        return this.cache.size;
    }

    cleanup() {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, value] of this.cache.entries()) {
            if (now > value.expiresAt) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`Cleaned ${cleaned} expired selectors from cache`);
        }

        return cleaned;
    }
}

module.exports = new SelectorCache();
