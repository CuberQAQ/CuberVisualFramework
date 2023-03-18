export default class CVFElement {
  /**
   * 构造函数
   * @param {{x: number, y: number, w: number, h: number}} border
   */
  constructor(border) {
    this.widgets = {};
    this.border = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    if (border) {
      border.x && (this.border.x = border.x);
      border.y && (this.border.y = border.y);
      border.w && (this.border.w = border.w);
      border.h && (this.border.h = border.h);
    }
    this.shapeRate = null;
    this.visible = false;
  }
  // These are non-condition functions need to be overloaded
  /**
   * 初始化（创建控件）
   * @abstract 必须由子类继承
   */
  init() {}
  /**
   * 清除控件
   * @abstract 必须由子类继承
   */
  clear() {}
  /**
   * 重绘元素
   * @abstract 必须由子类继承
   * @param {number} shapeRate 缩放比例
   * @param {{x: number, y: number}} offset Element相对屏幕中心的偏移
   * @param {boolean} lod 是否为低模优化显示模式
   * @param {number} alpha 深浅度[0,1]
   */
  redraw(shapeRate, offset, lod, alpha) {}
  /**
   * 更新绘制元素
   * @abstract 必须由子类继承
   * @param {number} shapeRate
   * @param {{x: number, y: number}} offset After Multi ShapeRate
   * @param {boolean} lod
   * @param {number} alpha 深浅度[0,1]
   */
  draw(shapeRate, offset, lod, alpha) {}
  /**
   * 隐藏元素
   * @abstract 必须由子类继承
   */
  hide() {}
}