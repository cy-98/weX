import { processConfig, proxy, setWatcher } from "./lib"
import { Controller } from './proxy/controller';
import expansion from './expansion'

/**
 * 
 * init  -> have ability to collect pages
 *                          -------------
 * epxand config -> expansion methods can visit plugin by 'this.$'
 *                                        -----------------------
 * 
 * user can inject his methods or data by 'custom' in options
 */

const mount = (options={}) => {
  const originPage = Page
  const { state, custom, watch } = options
  const controller = new Controller (state)

  Page = (config) => {
    config._controller = controller

    proxy(config, state)
    return originPage(
      processConfig(config, expansion, custom)
    )
  }
}

module.exports = {
  mount: mount
}