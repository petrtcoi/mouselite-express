import mongoose from "mongoose"
import { TubogRadiatorType } from "../typescript/types/tubogRadiatorType.type"



export type TubogModelType = {
        id: string
        type: TubogRadiatorType
        code: string
        name: string
        description: string | null
        interAxle: number
        width: number
        height: number
        lengthSection: number
        lengthBase: number
        dt70: number
        dt60: number
        dt50: number
        priceBase: number
        priceSection: number
        imageMain: string
        imagesList: string[]
        inStock: boolean
        colorId: string | null
        connectionId: string | null
        inStockSections: number[]
        volume: number
        weightSection: number
        sectionsMax: number
        sectionsRange: number[]
}

const schema = new mongoose.Schema<TubogModelType>({
        id: { type: String, required: true },
        type: { type: String, required: true },
        code: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: false },
        interAxle: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        lengthSection: { type: Number, required: true },
        lengthBase: { type: Number, required: true },
        dt70: { type: Number, required: true },
        dt60: { type: Number, required: true },
        dt50: { type: Number, required: true },
        priceBase: { type: Number, required: true },
        priceSection: { type: Number, required: true },
        imageMain: { type: String, required: true },
        imagesList: [{ type: String }],
        inStock: { type: Boolean, required: true },
        colorId: { type: String, required: false },
        connectionId: { type: String, required: false },
        inStockSections: [{ type: Number }],
        volume: { type: Number, required: true },
        weightSection: { type: Number, required: true },
        sectionsMax: { type: Number, required: true },
        sectionsRange: [{ type: Number }],
})


const TubogModel = mongoose.model('TubogModel', schema)

export default TubogModel