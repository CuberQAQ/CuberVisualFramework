import { CVFElement } from "../..";

declare class CVFText extends CVFElement {
  constructor(prop: {x: number, y: number, w: number, h: number, text: string, text_size: number}, visible: boolean): void
  
}

export default CVFText

let a = new CVFText()