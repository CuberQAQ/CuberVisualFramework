export default class CVFSurface {
  /**
   *
   * @param {{x: number, y: number, z: number}} pos
   * @param {{x1: number, x2: number, y1: number, y2: number}} border
   */
  constructor(pos, border) {
    this.elementDict = {};
    this.parent = null;
    this.center_pos = {
      x: 0,
      y: 0,
      z: 0,
    };
    if (pos) {
      pos.x && (this.center_pos.x = pos.x);
      pos.y && (this.center_pos.y = pos.y);
      pos.z && (this.center_pos.z = pos.z);
    }
    this.border = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    };
    if (border) {
      border.x1 && (this.border.x1 = border.x1);
      border.x2 && (this.border.x1 = border.x2);
      border.y1 && (this.border.x1 = border.y1);
      border.y2 && (this.border.x1 = border.y2);
    }
    // Rendering Border
    this._renBorder = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    };
    this.lod = false;
    this.visible = true;
    this.shapeRate = 1;
    this.offset = { x: 0, y: 0 };
    // Condition Params
    this.showing = false;
    this.blockedChanged = false;
    this.needCalculate = true;
    this.needDraw = false;
    this.needUnify = true; // Need To Redraw To Make Element Order Same
  } 
  addElement(element, key) {
    if (this.elementDict[key]) {
      return false;
    }
    this.elementDict[key] = element;
    this.needUnify = true;
    if (this.parent) {
      this.parent.needDraw = true;
    }
    this.needDraw = true;
    return true;
  }
  removeElement(key) {
    let element = this.elementDict[key]
    if (!element) {
      return false;
    }
    element.clear()
    this.elementDict[key] = undefined;
    return true;
  }
  init() {
    for (let key in this.elementDict) {
      this.elementDict[key].init();
    }
    this.needDraw = true;
    this.needCalculate = true;
  }
  /**
   * @description Delete All Element And Their Widgets
   */
  clear() {
    for (let key in this.elementDict) {
      this.elementDict[key].clear();
    }
    this.elementDict = {};
  }
  hide() {
    console.log("hide")
    for (let key in this.elementDict) {
      this.elementDict[key].hide();
    }
  }
  setShowing(showing) {
    if (showing != this.showing) {
      // for (let key in this.elementDict) {
      //     this.elementDict[key].draw(null, null, null, true)
      // }
      if (showing) {
        this.needDraw = true;
      } else {
        this.hide();
      }
      this.showing = showing;
      return true;
    }
    return false;
  }
  setLod(lod) {
    if (lod != this.lod) {
      this.needDraw = true;
      this.lod = lod;
    }
  }
  setVisible(visible) {
    if (visible != this.visible) {
      this.needDraw = true;
      this.visible = visible;
    }
  }
  redraw() {
    for (let key in this.elementDict) {
      this.elementDict[key].redraw(
        this.shapeRate,
        this.offset,
        this.lod,
        this.shapeRate
      );
    }
  }
  /**
   *
   * @param {{x: number, y: number, z: number}} pos
   */
  setCenterPos(pos) {
    if (!pos) return false;
    pos.x && (this.center_pos.x = pos.x);
    pos.y && (this.center_pos.y = pos.y);
    pos.z && (this.center_pos.z = pos.z);
    this.needDraw = true;
    this.needCalculate = true;
    this.parent && (this.parent.needCalculate = true)
    this.parent && (this.parent.needRender = true)
    this.parent && (this.parent.needOrder = true)
    this.parent && (this.parent.needDraw = true)
    return true
  }
  /**
   *
   * @param {{x1: number, x2: number, y1: number, y2: number}} border
   */
  setBorder(border) {
    if (!border) return false;
    border.x1 && (this.border.x1 = border.x1);
    border.x2 && (this.border.x1 = border.x2);
    border.y1 && (this.border.x1 = border.y1);
    border.y2 && (this.border.x1 = border.y2);
    this.needDraw = true;
    this.needCalculate = true;
    return true
  }
  draw() {
    if (this.needDraw) {
      for (let key in this.elementDict) {
        this.elementDict[key].draw(
          this.shapeRate,
          this.offset,
          this.lod,
          this.shapeRate
        );
      }
    }
  }
}
