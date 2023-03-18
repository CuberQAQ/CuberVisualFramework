import { createSmoothTimer, stopSmoothTimer } from "./fx"

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT, screenShape } = hmSetting.getDeviceInfo()
const TIMER_CIRCLE = 16
const TouchEventType = {
    CLICK_UP: 1,
    CLICK_DOWN: 2,
    MOVE: 3,
}

export class CVFUniverse {
    constructor() {
        this.surfaceDict = {}
        this.viewPos = {
            x: -200,
            y: -200,
            z: 0,
        }
        this.galaxyDict = {}
        this.VIEW_POINT_DISTANCE = 100
        this.DEFAULT_LOD_Z = 100
        this.BEYOND_VIEW_Z = 200
        this.timer = null
        this.needDraw = true
        this.needCaculateOrder = true
        this.needTestBlock = true
        this.needDCTouchLayer = true
        this.viewPosChanged = false
        this.touchLayerWidget = hmUI.createWidget(hmUI.widget.TEXT, {
            x: 0,
            y: 0,
            w: DEVICE_WIDTH,
            h: DEVICE_HEIGHT,
            text: ''
        })
        this.touchEvent = []
        this.touchListenerList = []
        this.layerOrder = [] // HmWearable的当前实际堆叠顺序 由底至顶 [CVFSurface, boolean] boolean代表是否有实际渲染出来
        this.touchLayerWidget.addEventListener(hmUI.event.CLICK_DOWN, info => this.touchEvent.push(info))
        this.touchLayerWidget.addEventListener(hmUI.event.MOVE, info => this.touchEvent.push(info))
        this.touchLayerWidget.addEventListener(hmUI.event.CLICK_UP, info => this.touchEvent.push(info))
    }
    eventProcess() {
        let eventCount = this.touchEvent.length
        for (let i = 0; i < eventCount; ++i) {

        }
    }
    /**
     * 
     * @param {CVFSurface} surface 
     * @param {string} key 
     * @returns 
     */
    addSurface(surface, key) {
        if (this.surfaceDict[key]) {
            return false
        }
        this.surfaceDict[key] = surface
        surface.parentUniverse = this
        surface.init()
        this.layerOrder.push([surface, false])
        this.needDraw = true
        this.needCaculateOrder = true
        this.needTestBlock = true
        // TODO DCTouchLayer ?
        return true
    }
    getKeyFromSurface(surface) {
        for (let key in this.surfaceDict) {
            if (this.surfaceDict[key] == surface) {
                return key
            }
        }
        return null
    }
    removeSurface(key) {
        if (!this.surfaceDict[key]) { return false }
        this.surfaceDict[key].delete()
        this.surfaceDict[key] = undefined
        return true
    }
    start() {
        if (this.timer) {
            return false
        }
        this.timer = createSmoothTimer(1, TIMER_CIRCLE,
            CVFUniverse.loop, { universe: this })
        return true
    }
    stop() {
        if (!this.timer) { return false }
        stopSmoothTimer(this.timer)
        this.timer = null
        return true
    }
    moveViewPos(pos) {
        if (!pos) return false
        pos.x && (this.viewPos.x = pos.x)
        pos.y && (this.viewPos.y = pos.y)
        pos.z && (this.viewPos.z = pos.z)
        this.needDraw = true
        this.needCaculateOrder = true
        this.needTestBlock = true
        return true
    }
    /**
     * 
     * @param {{universe: CVFUniverse}} param0 
     */
    static loop({ universe }) {
        // TODO
        // HmEventProcess
        universe.viewPos.y++
        universe.viewPos.x++
        universe.needDraw = true
        // TrackAnimStep
        // TODO
        // Calculate & Draw
        if (universe.needDraw) {
            for (let key in universe.surfaceDict) {
                var surface = universe.surfaceDict[key]
                // Unify
                if(surface.needUnify) {
                    surface.redraw()
                }
                // ForeCalculate
                if (surface.needCalculate) {
                    surface.shapeRate = universe.VIEW_POINT_DISTANCE
                        / (surface.center_pos.z - universe.viewPos.z)
                    surface.offset.x = (universe.viewPos.x - surface.center_pos.x) * surface.shapeRate
                    surface.offset.y = (universe.viewPos.y - surface.center_pos.y) * surface.shapeRate
                    surface._renBorder.x1 = surface.offset.x + surface.border.x1 * surface.shapeRate
                    surface._renBorder.y1 = surface.offset.y + surface.border.y1 * surface.shapeRate
                    surface._renBorder.x2 = surface.offset.x + surface.border.x2 * surface.shapeRate
                    surface._renBorder.y2 = surface.offset.y + surface.border.y2 * surface.shapeRate
                }
                // BeyondView || Invisible ? Hide
                if (universe.viewPosChanged || surface.needCalculate) {
                    if (!surface.visible
                        || surface.center_pos.z >= universe.BEYOND_VIEW_Z
                        || surface._renBorder.x1 > DEVICE_WIDTH / 2
                        || surface._renBorder.y1 > DEVICE_HEIGHT / 2
                        || surface._renBorder.x2 < 0 - DEVICE_WIDTH / 2
                        || surface._renBorder.y2 < 0 - DEVICE_HEIGHT / 2
                    ) {
                        if (surface.setShowing(false)) {
                            // Delete Surface Beyond View from Last Rendering List
                            let index = null
                            universe.layerOrder.find((item, i) => item[0] == surface ? index = i || true : false)
                            if (index != null) universe.layerOrder[index][1] = false
                        }
                    }
                    else {
                        if (surface.setShowing(true)) {
                            let index = null
                            universe.layerOrder.find((item, i) => item[0] == surface ? index = i || true : false)
                            if (index != null) universe.layerOrder[index][1] = true
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
                surface.draw()
            }
            universe.needDraw = false
        }
    }
}

export class CVFSurface {
    /**
     * 
     * @param {{x: number, y: number, z: number}} pos 
     * @param {{x1: number, x2: number, y1: number, y2: number}} border 
     */
    constructor(pos, border) {
        this.elementDict = {}
        this.blockAreaList = []
        this.parentUniverse = null
        this.center_pos = {
            x: 0,
            y: 0,
            z: 0,
        }
        if (pos) {
            pos.x && (this.center_pos.x = pos.x)
            pos.y && (this.center_pos.y = pos.y)
            pos.z && (this.center_pos.z = pos.z)
        }
        this.border = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        }
        if (border) {
            border.x1 && (this.border.x1 = border.x1)
            border.x2 && (this.border.x1 = border.x2)
            border.y1 && (this.border.x1 = border.y1)
            border.y2 && (this.border.x1 = border.y2)
        }
        // Rendering Border
        this._renBorder = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
        }
        this.lod = false
        this.visible = true
        this.needCalculate = true
        this.shapeRate = 1
        this.offset = { x: 0, y: 0 }
        // Condition Params
        this.showing = false
        this.blockedChanged = false
        this.needDraw = false
        this.needUnify = true // Need To Redraw To Make Element Order Same
        this.touchListen = false
    }
    addElement(element, key) {
        if (this.elementDict[key]) { return false }
        this.elementDict[key] = element
        this.needUnify = true
        if(this.parentUniverse) {this.parentUniverse.needDraw = true}
        this.needDraw = true
        return true
    }
    init() {
        for (let key in this.elementDict) {
            this.elementDict[key].init()
        }
        this.needDraw = true
        this.needCalculate = true
    }
    /**
     * @description Delete All Element And Their Widgets
     */
    clear() {
        for (let key in this.elementDict) {
            this.elementDict[key].clear()
        }
        this.elementDict = {}
    }
    hide() {
        for (let key in this.elementDict) {
            this.elementDict[key].hide()
        }
    }
    setShowing(bool) {
        if (bool != this.showing) {
            // for (let key in this.elementDict) {
            //     this.elementDict[key].draw(null, null, null, true)
            // }
            if (bool) { this.needDraw = true }
            else { this.hide() }
            this.showing = bool
            return true
        }
        return false
    }
    setLOD(lod) {
        if (lod != this.lod) {
            this.needDraw = true
            this.lod = lod
        }
    }
    setVisible(visible) {
        if (visible != this.visible) {
            this.needDraw = true
            this.visible = visible
        }
    }
    redraw() {
        for (let key in this.elementDict) {
            this.elementDict[key].redraw(this.shapeRate, this.offset, this.lod, this.shapeRate)
        }
    }
    /**
     * 
     * @param {{x: number, y: number, z: number}} pos 
     */
    setCenterPos(pos) {
        if (!pos) return false
        pos.x && (this.center_pos.x = pos.x)
        pos.y && (this.center_pos.y = pos.y)
        pos.z && (this.center_pos.z = pos.z)
        this.needDraw = true
        this.needCalculate = true
    }
    /**
     * 
     * @param {{x1: number, x2: number, y1: number, y2: number}} border 
     */
    setBorder(border) {
        if (!border) return false
        border.x1 && (this.border.x1 = border.x1)
        border.x2 && (this.border.x1 = border.x2)
        border.y1 && (this.border.x1 = border.y1)
        border.y2 && (this.border.x1 = border.y2)
        this.needDraw = true
        this.needCalculate = true
    }
    setBlockTested() {
        // TODO
    }
    /**
     * 
     * @param {number} shapeRate 
     * @param {{x: number, y: number}} offset <After> Multi ShapeRate 
     */
    draw() {
        if (this.needDraw) {
            for (let key in this.elementDict) {
                this.elementDict[key].draw(this.shapeRate, this.offset, this.lod, this.shapeRate)
            }
        }
    }
    delete() {
        for (let key in this.elementDict) {
            this.elementDict[key].delete() // TODO
            this.elementDict = {}
        }
    }
}

export class CVFElement {
    /**
     * 
     * @param {{x: number, y: number, w: number, h: number}} border 
     */
    constructor(border) {
        this.widgets = {}
        this.border = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        }
        if (border) {
            border.x && (this.border.x = border.x)
            border.y && (this.border.y = border.y)
            border.w && (this.border.w = border.w)
            border.h && (this.border.h = border.h)
        }
        this.shapeRate = null
        this.visible = false
    }
    // These are non-condition functions need to be overloaded
    // draw
}

export class CVFGalaxy {
    /**
     * 
     * @param {CVFUniverse} universe 
     */
    constructor(universe) {
        this.universe = universe ?? null
        this.surfaceDict = {}
    }
    /**
     * 
     * @param {CVFSurface} surface 
     * @param {string} key 
     * @returns 
     */
    addSurface(surface, key) {
        if (this.surfaceDict[key]) { // Already Exist
            return false
        }
        let existKey = this.universe.getKeyFromSurface(surface)
        if (existKey) {
            this.surfaceDict[existKey] = surface
            return true
        }
        else {
            if (this.universe.addSurface(surface, key)) {
                this.surfaceDict[key] = surface
                return true
            }
            else return false
        }
    }
    removeSurface(key) {
        if (this.surfaceDict[key]) {
            this.surfaceDict[key] = undefined
            return true
        }
        return false
    }
    deleteSurface(key) {
        if (this.surfaceDict[key]) {
            if (this.universe.removeSurface(key)) {
                this.surfaceDict[key] = undefined
                return true
            }
            else {
                this.surfaceDict[key] = undefined
                return false
            }
        }
        return false
    }
}

export class CVFRenderer {
    constructor() {

    }

}