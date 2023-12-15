import { CameraOptions } from "../Custom/Interfaces/CameraOptions.js";
import { LightingOptions } from "../Custom/Interfaces/LightingOptions.js";
import { ModelOptions } from "../Custom/Interfaces/ModelOptions.js";
import { RenderCrops } from "../Custom/Enums/RenderCrops.js";
import { RenderTypes } from "../Custom/Enums/RenderTypes.js";
import { SkinRenderOptions } from "../Custom/Interfaces/SkinRender.js";
import { fetchSkinInfo } from "./FetchSkinInfo.js";

interface SuccessResult {
    success: true,
    buffer: Buffer
    url: string
}

interface FailResult {
    success: false;
    error: string;
}

type FetchSkinRenderResult = SuccessResult | FailResult

interface CustomOptions {
    camera: Partial<CameraOptions>;
    lighting: Partial<LightingOptions>;
    model: Partial<ModelOptions>;
}

type FetchSkinRenderOptions = SkinRenderOptions & Partial<CustomOptions>

export async function fetchSkinRender(nickOrUIID: string, options?: FetchSkinRenderOptions): Promise<FetchSkinRenderResult> {
    if (typeof nickOrUIID !== "string"){
        throw new Error(`The nickOrUIID parameter expected the string type but received ${typeof nickOrUIID}`);
    }
    const type = options?.type || RenderTypes.Default
    const crop = options?.crop || RenderCrops.Full

    const url = new URL(process.env.BASE_URL + `skin-render/${type}/${nickOrUIID}/${crop}`);

    const loopParams = <T>(obj: T) => {
        for(const key in obj){
            const value = obj[key]
            if (typeof value !== "undefined"){
                url.searchParams.append(key, JSON.stringify(value));
            }
        }
    }

    if (options?.model) loopParams(options.model);
    if (options?.camera) loopParams(options.camera);
    if (options?.lighting) loopParams(options.lighting);
    
    const infoResult = await fetchSkinInfo(nickOrUIID);

    if (infoResult.success === false){
        return {
            success: false,
            error: infoResult.error
        }
    }

    const response = await fetch(url.href);
    const arrayBuffer = await response.arrayBuffer();

    return {
        success: true,
        buffer: Buffer.from(arrayBuffer),
        url: response.url as string
    }
}