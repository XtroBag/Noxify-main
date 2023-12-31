import { RenderCrops } from "../Enums/RenderCrops.js"
import { RenderTypes } from "../Enums/RenderTypes.js"

type CommonRenderCrops = RenderCrops.Full | RenderCrops.Bust | RenderCrops.Face

interface DefaultRenderType {
    type: RenderTypes.Default,
    crop: CommonRenderCrops
}
interface MarchingRenderType {
    type: RenderTypes.Marching,
    crop: CommonRenderCrops
}
interface WalkingRenderType {
    type: RenderTypes.Walking,
    crop: CommonRenderCrops
}
interface CrouchingRenderType {
    type: RenderTypes.Crouching,
    crop: CommonRenderCrops
}
interface CrossedRenderType {
    type: RenderTypes.Crossed,
    crop: CommonRenderCrops
}
interface CrissCrossRenderType {
    type: RenderTypes.CrissCross,
    crop: CommonRenderCrops
}
interface CheeringRenderType {
    type: RenderTypes.Cheering,
    crop: CommonRenderCrops
}
interface RelaxingRenderType {
    type: RenderTypes.Relaxing,
    crop: CommonRenderCrops
}
interface TrudgingRenderType {
    type: RenderTypes.Trudging,
    crop: CommonRenderCrops
}
interface CoweringRenderType {
    type: RenderTypes.Cowering,
    crop: CommonRenderCrops
}
interface PointingRenderType {
    type: RenderTypes.Pointing,
    crop: CommonRenderCrops
}
interface LungingRenderType {
    type: RenderTypes.Lunging,
    crop: CommonRenderCrops
}
interface DungeonsRenderType {
    type: RenderTypes.Dungeons,
    crop: CommonRenderCrops
}
interface FacepalmRenderType {
    type: RenderTypes.Facepalm,
    crop: CommonRenderCrops
}
interface UltimateRenderType {
    type: RenderTypes.Ultimate,
    crop: CommonRenderCrops
}
interface IsometricRenderType {
    type: RenderTypes.Isometric,
    crop: CommonRenderCrops
}
interface HeadRenderType {
    type: RenderTypes.Head,
    crop: RenderCrops.Full
}
interface BitzelRenderType {
    type: RenderTypes.Bitzel,
    crop: CommonRenderCrops
}
interface PixelRenderType {
    type: RenderTypes.Pixel,
    crop: CommonRenderCrops
}
interface OrnamentRenderType {
    type: RenderTypes.Ornament,
    crop: RenderCrops.Full
}
interface SkinRenderType {
    type: RenderTypes.Skin,
    crop: RenderCrops.Default | RenderCrops.Processed
}
interface DeadRenderType {
    type: RenderTypes.Dead,
    crop: RenderCrops.Full
}
interface ArcherRenderType {
    type: RenderTypes.Archer,
    crop: RenderCrops.Full
}
interface KickingRenderType {
    type: RenderTypes.Kicking,
    crop: RenderCrops.Full
}
interface SleepingRenderType {
    type: RenderTypes.Sleeping,
    crop: RenderCrops.Full
}

export type SkinRenderOptions = 
| DefaultRenderType 
| MarchingRenderType 
| WalkingRenderType 
| CrouchingRenderType 
| CrossedRenderType 
| CrissCrossRenderType 
| CheeringRenderType 
| RelaxingRenderType 
| TrudgingRenderType 
| CoweringRenderType 
| PointingRenderType 
| LungingRenderType 
| DungeonsRenderType 
| FacepalmRenderType 
| UltimateRenderType 
| IsometricRenderType 
| HeadRenderType 
| BitzelRenderType 
| PixelRenderType 
| OrnamentRenderType 
| SkinRenderType 
| DeadRenderType
| ArcherRenderType
| KickingRenderType
| SleepingRenderType