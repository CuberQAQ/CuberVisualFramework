import { CVFSurface } from "..";

export class CVFCard extends CVFSurface {
    constructor(pos, border) {
        super(pos, border)
        this.elementDict["cvfCard_mask"]
    }
    draw(shapeRate, offset) {
        super.draw(shapeRate, offset)
    }
}