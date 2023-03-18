import { CVFElement } from "../../base/CVFElement";

declare class CVFFillRect extends CVFElement {
  public constructor(
    prop: {
      x: number;
      y: number;
      w: number;
      h: number;
      radius: number;
      color: number;
    },
    
    visible: boolean
  ): void;
  public init(): void
  public clear(): void
  public draw(shapeRate: number, offset: {x: number, y: number}, lod: boolean, alpha: number): void
  public redraw(shapeRate: number, offset: {x: number, y: number}, lod: boolean, alpha: number): void
}

export default CVFFillRect;
