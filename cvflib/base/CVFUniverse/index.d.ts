import CVFSurface from "../CVFSurface"
import { SmoothTimer } from "../../utils/fx"

declare class CVFUniverse {
  protected surfaceDict: {[key: string]: CVFSurface} 
  protected surfaceLayer: Array<CVFSurface>
  protected viewPos: {x: number, y: number, z: number}
  protected VIEW_POINT_DISTANCE: number
  protected DEFAULT_LOD_Z: number
  protected BEYOND_VIEW_Z: number
  protected timer: SmoothTimer
  // Condition Signal 状态量
  public needRender: boolean
  public needOrder: boolean
  public needCalculate: boolean
  public needCalculateAll: boolean
  public needDraw: boolean
  public needDrawAll: boolean

  public constructor(): void
  public addSurface(surface: CVFSurface, key: String): boolean
  public removeSurface(key: String): boolean
  public getKeyFromSurface(surface: CVFSurface): string | null

  public moveViewPos(pos: {x?: number, y?: number, z?: number}): boolean
  
  public start(): boolean
  public stop(): boolean
  public static loop(universe: CVFUniverse): void
}
export default CVFUniverse