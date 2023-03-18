import CVFElement from "../../base/CVFElement";
import { Fx } from "../../utils/fx";

export default class CVFText extends CVFElement {
  /**
   *
   * @param {{x: number, y: number, w: number, h: number, text: string, text_size: number}} prop
   * @param {*} visible
   */
  constructor(prop, visible) {
    super(prop);
    if (!prop.text_size) prop.text_size = px(36);
    this.prop = { ...prop };
    this.visible = visible ?? true;
  }
  init() { 
    this.clear();
    this.widgets["text"] = hmUI.createWidget(hmUI.widget.TEXT, this.prop);
    this.widgets["text"].setProperty(hmUI.prop.VISIBLE, false);
  }
  clear() {
    if (this.widgets["text"]) {
      hmUI.deleteWidget(this.widgets["text"]);
      this.widgets["text"] = undefined;
    }
  }
  redraw(shapeRate, offset, lod, alpha) {
    this.clear();
    this.widgets["text"] = hmUI.createWidget(hmUI.widget.TEXT, {
      x: offset.x + this.prop.x * shapeRate,
      y: offset.y + this.prop.y * shapeRate,
      w: this.prop.w * shapeRate,
      h: this.prop.h * shapeRate,
      text_size: this.prop.text_size * shapeRate,
      color: Fx.getMixColor(0x000000, this.prop.color, alpha),
    });
    this.widgets["text"].setProperty(hmUI.prop.VISIBLE, this.visible && !lod);
  }
  /**
   *
   * @param {number} shapeRate
   * @param {{x: number, y: number}} offset After Multi ShapeRate
   * @param {boolean} lod
   * @returns
   */
  draw(shapeRate, offset, lod, alpha) {
    let text = this.widgets["text"];
    if (!this.visible || lod) {
      if (text) this.widgets["text"].setProperty(hmUI.prop.VISIBLE, false);
      return false;
    } else {
      this.widgets["text"].setProperty(hmUI.prop.VISIBLE, true);
      this.widgets["text"].setProperty(hmUI.prop.MORE, {
        x: offset.x + this.prop.x * shapeRate,
        y: offset.y + this.prop.y * shapeRate,
        w: this.prop.w * shapeRate,
        h: this.prop.h * shapeRate,
        text_size: this.prop.text_size * shapeRate,
        color: Fx.getMixColor(0x000000, this.prop.color, alpha),
      });
      return true;
    }
  }
  hide() {
    this.widgets["text"].setProperty(hmUI.prop.VISIBLE, false);
  }
}
