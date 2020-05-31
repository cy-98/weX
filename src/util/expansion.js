const _transPayload = v => v

const _clone = (obj) => {
    let result = null;
    if(typeof obj === 'object' && obj !== null) {
      result = obj instanceof Array ? [] : {};
      for(let v in obj) {
        result[v] = clone(obj[v])
      }
    }else {
      result = obj
    }
    return result;
}

const commit = function (payload) {
    const ctr = this._controller
    const data = {}
    for(const key in payload) {
        let value
        const fn = typeof payload[key] === 'function' ? payload[key] : null
        if(fn) {
            const state = this.$state[key]
            value = fn( _clone(state)) || state
        }else {
            value = payload[key]
        }
        data[key] = value
    }
    ctr.update(data, this)
}

const fetch = function (payload, cb) {
    const ctr  = this._controller

    if(Array.isArray(payload)) {
        const data = {}
        const resultArr = payload.map(key => { 
            const value = ctr.get(key, this)
            data[key] = _clone(value)
            return value
        })
        return cb ? cb(resultArr) : resultArr
    }

    if(typeof payload === 'object') {
        if(payload === null) { return null }
        const data = {}
        for(const key in payload) {
            const fn = typeof payload[key] === 'function' ? payload[key] : _transPayload
            const value = ctr.get(key, this)
            data[key] = fn( _clone(value))
        }
        return data
    }
    // if(typeof key !== 'string') { throw 'get的参数 必须为字符串或者数组或者对象  但是得到了一个' + typeof key }
    const value =  ctr.get(payload, this)
    const data = cb ? cb( _clone(value)) : value
    return data
}

const watch = function(watchers) {
    const ctr = this._controller
    for(const key in watchers) {
        const fn  = watchers[key]
        const wacther = {
            key : key + this.route,
            _isWatcher: true,
            run: fn
        }
        ctr.set(key, wacther)
    }
}

const deletePage = (key)=>{
    const ctr = this._controller
    ctr.delete(key, this)
    
}
export default {
    $commit: commit,
    $fetch: fetch,
    $watch: watch,
    $delete: deletePage
}