import mongoose from "mongoose"

import ProductSchema, { ProductType } from "./product.model"

type ProductConnectionType = {
    priceBase: number
    sort: number
} & ProductType

const schema = new mongoose.Schema<ProductConnectionType>({
    ...ProductSchema.obj,
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

const ProductConnection = mongoose.model('ProductConnection', schema)

export default ProductConnection
export type { ProductConnectionType }