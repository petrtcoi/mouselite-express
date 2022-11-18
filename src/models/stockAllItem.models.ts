import mongoose from 'mongoose'

type StockAllItem = {
    supplierCode: string
    sku: string
    title: string
    quantity: string
    comment?: string
}


const schema = new mongoose.Schema<StockAllItem>({
    supplierCode: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: false
    }
}, {
    timestamps: true
})

const StockAllItem = mongoose.model('StockAllItem', schema)

export default StockAllItem
export type { StockAllItem }