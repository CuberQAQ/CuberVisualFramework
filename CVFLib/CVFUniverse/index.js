export default class CVFUniverse {
  constructor() {
    this.surfaceDict = {};
    this.surfaceLayer = [];
    this.viewPos = {
      x: -200,
      y: -200,
      z: 0,
    };
    this.VIEW_POINT_DISTANCE = 100;
    this.DEFAULT_LOD_Z = 100;
    this.BEYOND_VIEW_Z = 200;
    this.timer = null;
    // Condition Property
    this.needRender = true;
    this.needCalculate = true;
    this.needOrder = true;
    this.needDraw = true;
    this.needCalculateAll = true;
    this.needDrawAll = true;
    // this.touchLayerWidget = hmUI.createWidget(hmUI.widget.TEXT, {
    //     x: 0,
    //     y: 0,
    //     w: DEVICE_WIDTH,
    //     h: DEVICE_HEIGHT,
    //     text: ''
    // })
    // this.touchEvent = []
    // this.touchListenerList = []
    // this.layerOrder = [] // HmWearable的当前实际堆叠顺序 由底至顶 [CVFSurface, boolean] boolean代表是否有实际渲染出来
    // this.touchLayerWidget.addEventListener(hmUI.event.CLICK_DOWN, info => this.touchEvent.push(info))
    // this.touchLayerWidget.addEventListener(hmUI.event.MOVE, info => this.touchEvent.push(info))
    // this.touchLayerWidget.addEventListener(hmUI.event.CLICK_UP, info => this.touchEvent.push(info))
  }
  // eventProcess() {
  //     let eventCount = this.touchEvent.length
  //     for (let i = 0; i < eventCount; ++i) {

  //     }
  // }
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
    surface.parentUniverse = this;
    surface.init();
    this.surfaceLayer.push(surface);
    this.needRender = true;
    this.needCalculate = true;
    this.needOrder = true;
    this.needDraw = true;
    // TODO DCTouchLayer ?

    return true;
  }
  // dcTouchLayer() {
  //     hmUI.deleteWidget()
  // }
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
    this.timer = createSmoothTimer(1, TIMER_CIRCLE, CVFUniverse.loop, this);
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
    // TODO test
    universe.moveViewPos({
      x: universe.viewPos.x + 1,
      y: universe.viewPos.y + 1,
    });
    // TrackAnimStep
    // TODO
    // Render
    if (universe.needRender) {
      for (let key in universe.surfaceDict) {
        var surface = universe.surfaceDict[key];
        // Unify
        if (surface.needUnify) {
          surface.redraw();
          surface.needUnify = false;
        }
        // ForeCalculate
        if (surface.needCalculate) {
          surface.shapeRate =
            universe.VIEW_POINT_DISTANCE /
            (surface.center_pos.z - universe.viewPos.z);
          surface.offset.x =
            (universe.viewPos.x - surface.center_pos.x) * surface.shapeRate;
          surface.offset.y =
            (universe.viewPos.y - surface.center_pos.y) * surface.shapeRate;
          surface._renBorder.x1 =
            surface.offset.x + surface.border.x1 * surface.shapeRate;
          surface._renBorder.y1 =
            surface.offset.y + surface.border.y1 * surface.shapeRate;
          surface._renBorder.x2 =
            surface.offset.x + surface.border.x2 * surface.shapeRate;
          surface._renBorder.y2 =
            surface.offset.y + surface.border.y2 * surface.shapeRate;
        }
        // BeyondView || Invisible ? Hide
        if (universe.needCalculateAll || surface.needCalculate) {
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
              let index = null;
              universe.layerOrder.find((item, i) =>
                item[0] == surface ? (index = i || true) : false
              );
              if (index != null) universe.layerOrder[index][1] = false;
            }
          } else {
            if (surface.setShowing(true)) {
              let index = null;
              universe.layerOrder.find((item, i) =>
                item[0] == surface ? (index = i || true) : false
              );
              if (index != null) universe.layerOrder[index][1] = true;
            }
          }
        }
        // // Calculate
        // if (universe.needCaculateOrder) {
        //     for (let key in universe.surfaceDict) {
        //         if (universe.surfaceDict[key].showing) {

        //         }
        //     }
        //     // ZMap 先暂时用Y轴顺序代替
        //     renderList.sort((a, b) => b.center_pos.z - a.center_pos.z)
        //     let dcList = []
        //     // newLength >= oldLength
        //     let oldLength = universe.renderList.length
        //     let newLength = renderList.length
        //     while (true) {
        //         if (oldLength < 0) { break }

        //     }
        // }
        // Draw
        surface.draw();
      }
      universe.needRender = false;
    }
  }
}

