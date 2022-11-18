import mongoose from "mongoose"


export type KradRadiatorType = {
    modelName: string,
    name: string
    price: number
    height: number
    depth: number
    length: number
    dt70: number
    dt60: number
    wall_consoles_name: string
}

const schema = new mongoose.Schema<KradRadiatorType>({
    modelName: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    height: { type: Number, required: true },
    depth: { type: Number, required: true },
    length: { type: Number, required: true },
    dt70: { type: Number, required: true },
    dt60: { type: Number, required: true },
    wall_consoles_name: { type: String, required: false }
})

const KradRadiator = mongoose.model('KradRadiator', schema)
export default KradRadiator