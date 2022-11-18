import mongoose from "mongoose"
import ProductSchema, { ProductType } from "./product.model"

type ProductColorType = {
    rateBase: number
    rateConnection: number
    priceBase: number
    sort: number
} & ProductType

const schema = new mongoose.Schema<ProductColorType>({
    ...ProductSchema.obj,
    rateBase: {
        type: Number,
        required: false,
    },
    rateConnection: {
        type: Number,
        required: false,
    },
    priceBase: {
        type: Number,
        required: false,
    },
    sort: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

schema.index({ group: 1, code: 1 }, { unique: true })

const ProductColor = mongoose.model('ProductColor', schema)

export default ProductColor
export type { ProductColorType }