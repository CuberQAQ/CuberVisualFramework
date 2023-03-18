declare class CVFElement {
  protected widgets: {[key: string]: HmWearableProgram.DeviceSide.HmUI.IHmUIWidget}
  protected border: {x: number, y: number, w: number, h: number}
  protected shapeRate: number
  protected visible: boolean
  public constructor(border: {x: number, y: number, w: number, h: number})
  public init(): void
  public clear(): void
  public hide(): void
  public draw(shapeRate: number, offset: {x: number, y: number}, lod: boolean, alpha: number): void
  public redraw(shapeRate: number, offset: {x: number, y: number}, lod: boolean, alpha: number): void
}

export default CVFElement