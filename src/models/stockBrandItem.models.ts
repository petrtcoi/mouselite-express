import mongoose from 'mongoose'


type StockBrandItemType = {
    supplierCode: string
    originalTitle: string
    comment?: string

    modelType: string
    model: string
    sections: number
    quantity: string
    color: string
    connection: string
}

const schema = new mongoose.Schema<StockBrandItemType>({
    supplierCode: { type: String, required: true },
    originalTitle: { type: String, required: true },
    comment: { type: String, required: false },
    modelType: { type: String, required: true },
    model: { type: String, required: true },
    sections: { type: Number, required: true },
    quantity: { type: String, required: true },
    color: { type: String, required: true },
    connection: { type: String, required: true }
}, {
    timestamps: true
})

const StockBrandItem = mongoose.model('StockBrandItem', schema)

export default StockBrandItem
export type { StockBrandItemType }

