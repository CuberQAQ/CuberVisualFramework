import { CVFElement } from "../../base/CVFElement";

declare class CVFText extends CVFElement {
  public constructor(
    prop: {
      x: number;
      y: number;
      w: number;
      h: number;
      text: string;
      text_size: number;
      color: number;
      align_h: HmWearableProgram.DeviceSide.HmUI.IHmUIAlign;
      align_v: HmWearableProgram.DeviceSide.HmUI.IHmUIAlign;
    },
    
    visible: boolean
  ): void;
  public init(): void
  public clear(): void
  public draw(shapeRate: number, offset: {x: number, y: number}, lod: boolean, alpha: number): void
  public redraw(shapeRate: number, offset: {x: number, y: number}, lod: boolean, alpha: number): void
}

export default CVFText;
