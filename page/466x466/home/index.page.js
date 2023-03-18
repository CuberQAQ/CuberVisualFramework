import { gettext } from "i18n"
import { CVFElement, CVFSurface, CVFUniverse } from "../../../CVFLib/index"
import { CVFText } from "../../../CVFLib/elements/text"
import { CVFFillRect } from "../../../CVFLib/elements/fillRect"
const logger = DeviceRuntimeCore.HmLogger.getLogger('home')
Page({
  build() {
    let universe = new CVFUniverse()
    
    {
      let surface = new CVFSurface({ x: -50, y: -160, z: 180 }, { x1: -100, x2: 200, y1: -50, y2: 50 })
      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      })
      let text = new CVFText({
        x: -90,
        y: -20,
        w: 120,
        h: 50,
        text: "Hello!",
        text_size: 36,
        color: 0xffffff,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)

      let subtext = new CVFText({
        x: -95,
        y: -45,
        w: 120,
        h: 35,
        text: "CVFLib",
        text_size: 24,
        color: 0xaaaaaa,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)
      universe.addSurface(surface, "card1")
      surface.addElement(bgd, "bgd")
      surface.addElement(text, "text")
      surface.addElement(subtext, "subtext")
    }
    {
      let surface = new CVFSurface({ x: -50, y: 160, z: 180 }, { x1: -100, x2: 200, y1: -50, y2: 50 })
      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      })
      let text = new CVFText({
        x: -90,
        y: -20,
        w: 120,
        h: 50,
        text: "Hello!",
        text_size: 36,
        color: 0xffffff,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)

      let subtext = new CVFText({
        x: -95,
        y: -45,
        w: 120,
        h: 35,
        text: "CVFLib",
        text_size: 24,
        color: 0xaaaaaa,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)
      universe.addSurface(surface, "card2")
      surface.addElement(bgd, "bgd")
      surface.addElement(text, "text")
      surface.addElement(subtext, "subtext")
    }
    {
      let surface = new CVFSurface({ x: -50, y: -80, z: 140 }, { x1: -100, x2: 200, y1: -50, y2: 50 })
      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      })
      let text = new CVFText({
        x: -90,
        y: -20,
        w: 120,
        h: 50,
        text: "Hello!",
        text_size: 36,
        color: 0xffffff,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)

      let subtext = new CVFText({
        x: -95,
        y: -45,
        w: 120,
        h: 35,
        text: "CVFLib",
        text_size: 24,
        color: 0xaaaaaa,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)
      universe.addSurface(surface, "card3")
      surface.addElement(bgd, "bgd")
      surface.addElement(text, "text")
      surface.addElement(subtext, "subtext")
    }
    {
      let surface = new CVFSurface({ x: -50, y: 80, z: 140 }, { x1: -100, x2: 200, y1: -50, y2: 50 })
      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      })
      let text = new CVFText({
        x: -90,
        y: -20,
        w: 120,
        h: 50,
        text: "Hello!",
        text_size: 36,
        color: 0xffffff,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)

      let subtext = new CVFText({
        x: -95,
        y: -45,
        w: 120,
        h: 35,
        text: "CVFLib",
        text_size: 24,
        color: 0xaaaaaa,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)
      universe.addSurface(surface, "card4")
      surface.addElement(bgd, "bgd")
      surface.addElement(text, "text")
      surface.addElement(subtext, "subtext")
    }

    {
      let surface = new CVFSurface({ x: -50, y: 0, z: 100 }, { x1: -100, x2: 200, y1: -50, y2: 50 })
      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      })
      let text = new CVFText({
        x: -90,
        y: -20,
        w: 120,
        h: 50,
        text: "Hello!",
        text_size: 36,
        color: 0xffffff,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)

      let subtext = new CVFText({
        x: -95,
        y: -45,
        w: 120,
        h: 35,
        text: "CVFLib",
        text_size: 24,
        color: 0xaaaaaa,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.LEFT,
      }, true)
      universe.addSurface(surface, "card5")
      surface.addElement(bgd, "bgd")
      surface.addElement(text, "text")
      surface.addElement(subtext, "subtext")
    }
    let title = new CVFSurface({ x: 0, y: -180, z: 100 },)
    let titleText = new CVFText({
      x: -100,
      y: -15,
      w: 200,
      h: 50,
      text: "选择一张卡片",
      text_size: 28,
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H,
    })
    universe.addSurface(title, "title")
    title.addElement(titleText, "text")
    universe.start()
  },
  onInit() {
    logger.debug('page onInit invoked')
  },

  onDestroy() {
    logger.debug('page onDestroy invoked')
  },
})