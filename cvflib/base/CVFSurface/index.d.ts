import CVFElement from "../CVFElement"
declare class CVFSurface {
  protected elementDict: {[key: string]: CVFElement}
  protected parent: CVFElement | null
  protected visible: boolean
  protected shapeRate: number
  protected offset: {x: number, y: number}
  public lod: boolean
  protected center_pos: {x: number, y: number, z: number}
  public constructor(pos: {x: number, y: number, z: number}, border: {x1: number,x2: number,y1: number,y2: number})
  public _renBorder: {x1: number,x2: number,y1: number,y2: number}
  // Condition Signal 状态量
  public showing: boolean
  public needCalculate: boolean
  public needDraw: boolean
  public needUnify: boolean

  public addElement(element: CVFElement, key: string): boolean
  public removeElement(key: string): boolean
  public init(): void
  public clear(): void
  public hide(): void
  public draw(): void
  public redraw(): void

  public setShowing(showing: boolean): boolean
  public setLod(lod: boolean): boolean
  public setVisible(visible: boolean): boolean
  public setCenterPos(pos: {x: number, y: number, z: number}): boolean
  public setBorder(border: {x1: number, x2: number, y1: number, y2: number}): boolean 
}
export default CVFSurface