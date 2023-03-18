import { gettext } from "i18n";
import { Fx } from "../../../utils/fx";
const logger = DeviceRuntimeCore.HmLogger.getLogger("home");
Page({
  build() {
    const protectDialog = hmUI.createDialog({
      title: gettext('protect') + (2 - 1) + '%?',
      //show: true,
      auto_hide: true,
      click_linster: function (param) {
        logger.debug(JSON.stringify(param))
        //if (key == 1) hmApp.gotoPage({ file: 'page/gtr3-pro/home/sos' })
        //protectDialog.show(false)
      }
    })
    protectDialog.show(true)
  },
  onInit() {
    logger.debug("page onInit invoked");
  },

  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});
