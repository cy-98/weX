const _assign = (source, target) => {
    return Object.assign(target, source)
}

const processConfig = (config, expansion, methods = {}) => {
    // config(origin) > expansion > options
    // put expansion's keys and options'keys on config
    // extra keys won't cover Page's original keys

    return _assign(
        _assign(config, expansion),
        methods)
}

const proxy = (config, state) => {
    config.$state = Object.create(null)
    Object.defineProperty(config, '$state', {
        get: () => {
            return state
        }
    })
}


module.exports = {
    proxy: proxy,
    processConfig: processConfig
}