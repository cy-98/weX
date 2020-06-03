
class Controller {
    constructor(state = {}) {                                                                                // save global state that will be used in other pages
        this.state = state                                                                                         // state.setter: () => err('not allowed change this property by the way out of this.$commit')
        this.obsMap = this._init(state)
    }
    
    // 获取state的某个值并且收集页面
    get(key, page) {
        if (this._findSet(key) && page) {
            this._collectPage(key, page)
        }
        return this.state[key]
    }

    // 根据传入的字段更新页面
    update(payload, currentPage) {
        const updateImmediateState = {}
        const updateAsyncStateMap = new Map()

        let tempSet
        new Promise ((resolve, reject) => {                                                                            // O(n²)
            for(const key in payload) {
                const value = payload[key]
                tempSet = this._findSet(key)

                if(tempSet.has(currentPage)) {
                    (updateImmediateState[key] = value) 
                }  

                tempSet.forEach(page => {                                                                                           // collect data should be updated async
                    if(page != currentPage) {
                        let state = updateAsyncStateMap.get(page)      
                        state ? (state[key] = value) : (state = { [key] : value })
                        updateAsyncStateMap.set(page, state)
                    }
                })
            }
            currentPage.setData(updateImmediateState)

            resolve()
        })
            .then(()=>{
                const queue = []
                updateAsyncStateMap.forEach((data, page) => {
                    queue.push(
                        page._isWatcher? 
                            ()=> page.run() :
                            () => page.setData(data)
                    )
                })
                return queue
            })
            .then(queue => {
                queue.forEach(fn => fn())
            })
    }
    delete(key, id) {
        const set = this._findSet(key)
        set.forEach(m => {
            m.route === id || m.key === id
                &&                                                           // delete page by route  &  delete watcher by id
            set.delete(m)
        })
    }
    _init(state) {
        const map = new Map()
        for (const key in state) {
            map.set(key, new Set())
        }
        return map
    }
    _collectPage(key, page) {
        const set = this._findSet(key)
        const isHas = set.has(page)
        if(isHas) { return }
        set.add(page)
    }
    _findSet(key){
        return this.obsMap.get(key)
    }
}

module.exports = {
    Controller: Controller
}