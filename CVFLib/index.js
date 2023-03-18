import { createSmoothTimer, stopSmoothTimer } from "./fx";

export const {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT,
  screenShape,
} = hmSetting.getDeviceInfo();
const TIMER_CIRCLE = 16;
const TouchEventType = {
  CLICK_UP: 1,
  CLICK_DOWN: 2,
  MOVE: 3,
};




export class CVFGalaxy {
  /**
   *
   * @param {CVFUniverse} universe
   */
  constructor(universe) {
    this.universe = universe ?? null;
    this.surfaceDict = {};
  }
  /**
   *
   * @param {CVFSurface} surface
   * @param {string} key
   * @returns
   */
  addSurface(surface, key) {
    if (this.surfaceDict[key]) {
      // Already Exist
      return false;
    }
    let existKey = this.universe.getKeyFromSurface(surface);
    if (existKey) {
      this.surfaceDict[existKey] = surface;
      return true;
    } else {
      if (this.universe.addSurface(surface, key)) {
        this.surfaceDict[key] = surface;
        return true;
      } else return false;
    }
  }
  removeSurface(key) {
    if (this.surfaceDict[key]) {
      this.surfaceDict[key] = undefined;
      return true;
    }
    return false;
  }
  deleteSurface(key) {
    if (this.surfaceDict[key]) {
      if (this.universe.removeSurface(key)) {
        this.surfaceDict[key] = undefined;
        return true;
      } else {
        this.surfaceDict[key] = undefined;
        return false;
      }
    }
    return false;
  }
}

export class CVFRenderer {
  constructor() {}
}
