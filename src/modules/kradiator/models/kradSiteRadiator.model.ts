import mongoose from "mongoose"
import KradSiteModel, { KradSiteModelType } from "./kradSiteModel.model"


export type KradSiteRadiatorType = {
    modelId: string,
    name: string
    description?: string
    columns: number
    interaxle: number
    sections: number
    price: number
    height: number
    depth: number
    length: number
    weight?: number
    volume?: number
    dt70: number
    dt60: number
    wall_consoles_name?: string
    wall_consoles_image?: string
}

const schema = new mongoose.Schema<KradSiteRadiatorType>({
    modelId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    columns: { type: Number, required: true },
    interaxle: { type: Number, required: true },
    sections: { type: Number, required: true },
    price: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true },
    length: { type: Number, required: true },
    weight: { type: Number, required: false },
    volume: { type: Number, required: false },
    dt70: { type: Number, required: true },
    dt60: { type: Number, required: true },
    wall_consoles_name: { type: String, required: false },
    wall_consoles_image: { type: String, required: false }
})

const KradSiteRadiator = mongoose.model('KradSiteRadiator', schema)
export default KradSiteRadiator