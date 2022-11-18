import mongoose from "mongoose"
import { TubogRadiatorType } from "../typescript/types/tubogRadiatorType.type"



export type TubogConnectionType = {
        id: string
        type: TubogRadiatorType
        code: string
        name: string
        thread: string
        price: number
        image: string
}

const schema = new mongoose.Schema<TubogConnectionType>({
        id: { type: String, required: true },
        type: { type: String, required: true },
        code: { type: String, required: true },
        name: { type: String, required: true },
        thread: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
})


const TubogConnection = mongoose.model('TubogConnection', schema)

export default TubogConnection