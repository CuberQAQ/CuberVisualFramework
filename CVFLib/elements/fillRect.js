import { CVFElement } from "..";
import { Fx } from "../fx";

export class CVFFillRect extends CVFElement {
    /**
     * 
     * @param {{x: number, y: number, w: number, h: number, radius: number}} prop 
     * @param {*} visible 
     */
    constructor(prop, visible) {
        super(prop)
        if (!prop.radius) prop.radius = 0
        this.prop = { ...prop }
        this.visible = visible ?? true
    }
    init() {
        this.clear()
        this.widgets["fillRect"] = hmUI.createWidget(hmUI.widget.FILL_RECT, this.prop)
        this.widgets["fillRect"].setProperty(hmUI.prop.VISIBLE, false)
    }
    clear() {
        if (this.widgets["fillRect"]) {
            hmUI.deleteWidget(this.widgets["fillRect"])
            this.widgets["fillRect"] = undefined
        }
    }
    redraw(shapeRate, offset, lod, alpha) {
        this.clear()
        this.widgets["fillRect"] = hmUI.createWidget(hmUI.widget.FILL_RECT, {
            x: offset.x + this.prop.x * shapeRate,
            y: offset.y + this.prop.y * shapeRate,
            w: this.prop.w * shapeRate,
            h: this.prop.h * shapeRate,
            radius: this.prop.radius * shapeRate,
            color: Fx.getMixColor(0x000000, this.prop.color, alpha)
        })
        this.widgets["fillRect"].setProperty(hmUI.prop.VISIBLE, this.visible && !lod)
    }
    /**
     * 
     * @param {number} shapeRate 
     * @param {{x: number, y: number}} offset After Multi ShapeRate
     * @param {boolean} lod 
     * @param {boolean} beyondView 
     * @returns 
     */
    draw(shapeRate, offset, lod, alpha) {
        if (!this.visible || lod) {
            this.widgets["fillRect"].setProperty(hmUI.prop.VISIBLE, false)
            return false
        }
        else {
            this.widgets["fillRect"].setProperty(hmUI.prop.VISIBLE, true)
            this.widgets["fillRect"].setProperty(hmUI.prop.MORE, {
                x: offset.x + this.prop.x * shapeRate,
                y: offset.y + this.prop.y * shapeRate,
                w: this.prop.w * shapeRate,
                h: this.prop.h * shapeRate,
                radius: this.prop.radius * shapeRate,
                color: Fx.getMixColor(0x000000, this.prop.color, alpha)
            })
        }
    }
    hide() {
        this.widgets["fillRect"].setProperty(hmUI.prop.VISIBLE, false)
    }
}