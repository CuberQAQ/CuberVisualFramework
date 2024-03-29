import { gettext } from "i18n";
import { CVFFillRect, CVFSurface, CVFText, CVFUniverse } from "../../../cvflib";
import { Fx, setTimeout } from "../../../utils/fx";
const logger = DeviceRuntimeCore.HmLogger.getLogger("home");
Page({
  build() {
    let universe = new CVFUniverse();
    let galtest = {
      offsetY: -100,
      getZFromY(y) {
        if (y == 0) return 100;
        else if (y > 0) return 100 + 0.5 * y;
        else if (y < 0) return 100 - 0.5 * y;
      },
      getPosFromData(rawY) {
        let resY = rawY + this.offsetY;
        let resZ = this.getZFromY(resY)
       //  console.log(JSON.stringify({resY, resZ}))
        return {
          y: resY,
          z: resZ,
        };
      },
      surList: [],
      surRawPos: [],
      /**
       *
       * @param {CVFSurface} surface
       */
      addSurface(surface) {
        this.surList.push(surface);
        this.surRawPos.push({ ...surface.center_pos });
      },
      track() {
        for (let i = 0; i < this.surList.length; ++i) {
          this.surList[i].setCenterPos(
            this.getPosFromData(this.surRawPos[i].y)
          );
        }
      },
    };
    {
      let surface = new CVFSurface(
        { x: -50, y: -160, z: 180 },
        { x1: -100, x2: 200, y1: -50, y2: 50 }
      );
      galtest.addSurface(surface)
      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      });
      let text = new CVFText(
        {
          x: -90,
          y: -20,
          w: 120,
          h: 50,
          text: "Hello!",
          text_size: 36,
          color: 0xffffff,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );

      let subtext = new CVFText(
        {
          x: -95,
          y: -45,
          w: 120,
          h: 35,
          text: " CVFLib",
          text_size: 24,
          color: 0xaaaaaa,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );
      universe.addSurface(surface, "card1");
      surface.addElement(bgd, "bgd");
      surface.addElement(text, "text");
      surface.addElement(subtext, "subtext");
    }
    {
      let surface = new CVFSurface(
        { x: -50, y: 160, z: 180 },
        { x1: -100, x2: 200, y1: -50, y2: 50 }
      );
      galtest.addSurface(surface)

      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      });
      let text = new CVFText(
        {
          x: -90,
          y: -20,
          w: 120,
          h: 50,
          text: "Hello!",
          text_size: 36,
          color: 0xffffff,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );

      let subtext = new CVFText(
        {
          x: -95,
          y: -45,
          w: 120,
          h: 35,
          text: " CVFLib",
          text_size: 24,
          color: 0xaaaaaa,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );
      universe.addSurface(surface, "card2");
      surface.addElement(bgd, "bgd");
      surface.addElement(text, "text");
      surface.addElement(subtext, "subtext");
    }
    {
      let surface = new CVFSurface(
        { x: -50, y: -80, z: 140 },
        { x1: -100, x2: 200, y1: -50, y2: 50 }
      );
      galtest.addSurface(surface)

      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      });
      let text = new CVFText(
        {
          x: -90,
          y: -20,
          w: 120,
          h: 50,
          text: "Hello!",
          text_size: 36,
          color: 0xffffff,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );

      let subtext = new CVFText(
        {
          x: -95,
          y: -45,
          w: 120,
          h: 35,
          text: " CVFLib",
          text_size: 24,
          color: 0xaaaaaa,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );
      universe.addSurface(surface, "card3");

      surface.addElement(bgd, "bgd");
      surface.addElement(text, "text");
      surface.addElement(subtext, "subtext");
    }
    {
      let surface = new CVFSurface(
        { x: -50, y: 80, z: 140 },
        { x1: -100, x2: 200, y1: -50, y2: 50 }
      );
      galtest.addSurface(surface)

      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      });
      let text = new CVFText(
        {
          x: -90,
          y: -20,
          w: 120,
          h: 50,
          text: "Hello!",
          text_size: 36,
          color: 0xffffff,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );

      let subtext = new CVFText(
        {
          x: -95,
          y: -45,
          w: 120,
          h: 35,
          text: " CVFLib",
          text_size: 24,
          color: 0xaaaaaa,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );
      universe.addSurface(surface, "card4");
      surface.addElement(bgd, "bgd");
      surface.addElement(text, "text");
      surface.addElement(subtext, "subtext");
    }

    {
      let surface = new CVFSurface(
        { x: -50, y: 0, z: 100 },
        { x1: -100, x2: 200, y1: -50, y2: 50 }
      );
      galtest.addSurface(surface)

      let bgd = new CVFFillRect({
        x: -100,
        y: -50,
        w: 300,
        h: 100,
        radius: 25,
        color: 0x333333,
      });
      let text = new CVFText(
        {
          x: -90,
          y: -20,
          w: 120,
          h: 50,
          text: "Hello!",
          text_size: 36,
          color: 0xffffff,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );

      let subtext = new CVFText(
        {
          x: -95,
          y: -45,
          w: 120,
          h: 35,
          text: " CVFLib",
          text_size: 24,
          color: 0xaaaaaa,
          align_h: hmUI.align.CENTER_H,
          align_v: hmUI.align.LEFT,
        },
        true
      );
      universe.addSurface(surface, "card5");
      surface.addElement(bgd, "bgd");
      surface.addElement(text, "text");
      surface.addElement(subtext, "subtext");
    }
    let title = new CVFSurface({ x: 0, y: -180, z: 100 });
    let titleText = new CVFText({
      x: -100,
      y: -15,
      w: 200,
      h: 50,
      text: "选择一张卡片",
      text_size: 28,
      color: 0xffffff,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
    });
    title.addElement(titleText, "text");
    universe.addSurface(title, "title");

    
    universe.start();
    new Fx({
      delay: 1000,
      begin: -200,
      end: 200,
      fps: 60,
      time: 3,
      func: (res) => {
        galtest.offsetY = res
        galtest.track()
      },
      style: Fx.Styles.LINEAR,
      onStop: () => {}
    }).restart()
  },
  onInit() {
    logger.debug("page onInit invoked");
  },

  onDestroy() {
    logger.debug("page onDestroy invoked");
  },
});
