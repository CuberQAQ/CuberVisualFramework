import { createSmoothTimer, stopSmoothTimer } from "../../utils/fx";
import CVFSurface from "../CVFSurface";
export const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  screenShape,
} = hmSetting.getDeviceInfo();
const TIMER_CIRCLE = 16;
export default class CVFUniverse {
  constructor() {
    this.surfaceDict = {};
    this.surfaceLayer = [];
    this.viewPos = {
      x: 0,
      y: 0,
      z: 20,
    };
    this.VIEW_POINT_DISTANCE = 100;
    this.DEFAULT_LOD_Z = 200;
    this.BEYOND_VIEW_Z = 300;
    this.timer = null;
    // Condition Property
    this.needRender = true;
    this.needCalculate = true;
    this.needOrder = true;
    this.needDraw = true;
    this.needCalculateAll = true;
    this.needDrawAll = true;
  }
  /**
   *
   * @param {CVFSurface} surface
   * @param {string} key
   * @returns
   */
  addSurface(surface, key) {
    if (this.surfaceDict[key]) {
      return false;
    }
    this.surfaceDict[key] = surface;
    surface.parent = this;
    surface.init();
    this.surfaceLayer.push(surface);
    this.needRender = true;
    this.needCalculate = true;
    this.needOrder = true;
    this.needDraw = true;
    // TODO DCTouchLayer ?
    return true;
  }
  getKeyFromSurface(surface) {
    for (let key in this.surfaceDict) {
      if (this.surfaceDict[key] == surface) {
        return key;
      }
    }
    return null;
  }
  removeSurface(key) {
    let surface = this.surfaceDict[key];
    if (!surface) {
      return false;
    }

    surface.clear();
    surface.parentUniverse = null;
    let length = this.surfaceLayer.length;
    for (let i = 0; i < length; ++i) {
      if (this.surfaceLayer[i] == surface) {
        this.surfaceLayer.splice(i, 1);
        break;
      }
    }
    this.surfaceDict[key] = undefined;
    return true;
  }
  start() {
    if (this.timer) {
      return false;
    }
    this.timer = createSmoothTimer(10, TIMER_CIRCLE, CVFUniverse.loop, this);
    return true;
  }
  stop() {
    if (!this.timer) {
      return false;
    }
    stopSmoothTimer(this.timer);
    this.timer = null;
    return true;
  }
  /**
   *
   * @param {{x?: number, y?: number, z?: number}} pos
   * @returns
   */
  moveViewPos(pos) {
    if (!pos) return false;
    pos.x && (this.viewPos.x = pos.x);
    pos.y && (this.viewPos.y = pos.y);
    pos.z && (this.viewPos.z = pos.z);
    this.needRender = true;
    this.needCalculate = true;
    this.needCalculateAll = true;
    this.needOrder = true;
    this.needDraw = true;
    this.needDrawAll = true;
    return true;
  }
  /**
   *
   * @param {CVFUniverse} universe
   */
  static loop(universe) {
    // TODO
    // HmEventProcess
    // TrackAnimStep
    // TODO
    // let sur = universe.surfaceDict["card3"];
    // sur.setCenterPos({
    //   z: sur.center_pos.z - 1,
    // });
    // let sur2 = universe.surfaceDict["card5"];
    // sur2.setCenterPos({
    //   z: sur2.center_pos.z + 1,
    // })

    // Render
    if (universe.needRender) {
      for (let key in universe.surfaceDict) {
        let surface = universe.surfaceDict[key];
        // Unify
        if (surface.needUnify) {
          surface.redraw();
          for (let i = 0; i < universe.surfaceLayer.length; i++) {
            const surface = universe.surfaceLayer.splice(i, 1)[0];
            universe.surfaceLayer.push(surface);
          }
          surface.needUnify = false;
        }
        // ForeCalculate
        if (universe.needCalculateAll || surface.needCalculate) {
          surface.shapeRate =
            universe.VIEW_POINT_DISTANCE /
            (surface.center_pos.z - universe.viewPos.z);
          surface.offset.x =
            (surface.center_pos.x - universe.viewPos.x) * surface.shapeRate +
            DEVICE_WIDTH / 2;
          surface.offset.y =
            (surface.center_pos.y - universe.viewPos.y) * surface.shapeRate +
            DEVICE_HEIGHT / 2;
          surface._renBorder.x1 =
            surface.offset.x + surface.border.x1 * surface.shapeRate;
          surface._renBorder.y1 =
            surface.offset.y + surface.border.y1 * surface.shapeRate;
          surface._renBorder.x2 =
            surface.offset.x + surface.border.x2 * surface.shapeRate;
          surface._renBorder.y2 =
            surface.offset.y + surface.border.y2 * surface.shapeRate;
          surface.setLod(surface.center_pos.z >= universe.DEFAULT_LOD_Z)
          // BeyondView || Invisible ? Hide
          if (
            !surface.visible ||
            surface.center_pos.z >= universe.BEYOND_VIEW_Z ||
            surface._renBorder.x1 > DEVICE_WIDTH / 2 ||
            surface._renBorder.y1 > DEVICE_HEIGHT / 2 ||
            surface._renBorder.x2 < 0 - DEVICE_WIDTH / 2 ||
            surface._renBorder.y2 < 0 - DEVICE_HEIGHT / 2
          ) {
            if (surface.setShowing(false)) {
              // Delete Surface Beyond View from Last Rendering List
              // let index = null;
              // universe.layerOrder.find((item, i) =>
              //   item[0] == surface ? (index = i || true) : false
              // );
              // if (index != null) universe.layerOrder[index][1] = false;
            }
          } else {
            if (surface.setShowing(true)) {
              // let index = null;
              // universe.layerOrder.find((item, i) =>
              //   item[0] == surface ? (index = i || true) : false
              // );
              // if (index != null) universe.layerOrder[index][1] = true;
            }
          }
          surface.needCalculate = false;
        }
      }
      if (universe.needOrder) {
        let rawOrder = [];
        for (let i = 0; i < universe.surfaceLayer.length; i++) {
          const element = universe.surfaceLayer[i];
          if (element.showing) rawOrder.push(element);
        }
        let rawOut = []
        rawOrder.forEach(item => {
          rawOut.push({key: universe.getKeyFromSurface(item), z: item.center_pos.z})
        })
        console.log(JSON.stringify({rawOut}))
        let targetOrder = rawOrder.slice();
        targetOrder.sort((a, b) => b.center_pos.z - a.center_pos.z);
        let tarOut = []
        targetOrder.forEach(item => {
          tarOut.push({key: universe.getKeyFromSurface(item), z: item.center_pos.z})
        })
        console.log(JSON.stringify({tarOut}))
        let dcOrder = [];
        let showSurNumber = targetOrder.length;
        let rIndex = 0,
          tIndex = 0;

        // Calculate DC Order
        while (true) {
          if (rIndex >= showSurNumber) {
            dcOrder = targetOrder.slice(tIndex);
            break;
          }
          if (rawOrder[rIndex] == targetOrder[rIndex]) ++tIndex;
          ++rIndex;
          continue;
        }
        let dcOut = []
        dcOrder.forEach(item => {
          dcOut.push({key: universe.getKeyFromSurface(item), z: item.center_pos.z})
        })
        console.log(JSON.stringify({dcOut}))

        // DC & Update Universe.surfaceLayer
        for (let i = 0; i < dcOrder.length; ++i) {
          dcOrder[i].redraw();
          let msg = ""
          for (let j = 0; j < universe.surfaceLayer.length; j++) {
            const element = universe.surfaceLayer[j];
            msg += ("[" + j + "]a:"+universe.getKeyFromSurface(element)+" b:"+universe.getKeyFromSurface(dcOrder[i])+"")
            if (element == dcOrder[i]) {
              universe.surfaceLayer.push(universe.surfaceLayer.splice(j, 1)[0]);
              
              console.log("Successfully Find!:"+msg);
            break
            }
            if(j == universe.surfaceLayer.length - 1) {console.log("Cannot find!"+msg);}
          }
        }
      }
      if (universe.needDraw) {
        for (let key in universe.surfaceDict) {
          let surface = universe.surfaceDict[key];
          if (universe.needDrawAll || surface.needDraw) {
            surface.draw();
            surface.needDraw = false;
          }
        }
      }
      universe.needRender = false;
      universe.needCalculate = false;
      universe.needCalculateAll = false;
      universe.needDraw = false;
      universe.needDrawAll = false;
    }
  }
}
