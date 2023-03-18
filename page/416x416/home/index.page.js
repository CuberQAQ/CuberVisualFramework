import { gettext } from "i18n"
const logger = DeviceRuntimeCore.HmLogger.getLogger('home')
Page({
  build() {
   
  },
  onInit() {
    logger.debug('page onInit invoked')
  },

  onDestroy() {
    logger.debug('page onDestroy invoked')
  },
})